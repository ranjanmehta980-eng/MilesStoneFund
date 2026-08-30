import {
  isConnected,
  isAllowed,
  setAllowed,
  getAddress,
  requestAccess,
  signTransaction,
  getNetwork,
} from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

export const STELLAR_CONFIG = {
  network: 'TESTNET',
  networkPassphrase: StellarSdk.Networks.TESTNET,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  horizonUrl: 'https://horizon-testnet.stellar.org',
  friendbotUrl: 'https://friendbot.stellar.org',
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || 'CBTY543E4B75N32Z77W6V5P2K76U7Y4NKLMZ7UQQ7X43D23V46B4MLST',
  // Escrow Vault Account on Testnet to receive and hold locked campaign funds
  escrowVaultAddress: 'GB7N5B3WQK6ZTY72W4M8Q9XL6K4D7E5R3T2Y1U0P9O8I7U6Y5T4R3E2W',
};

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: string | null;
  balance: string;
  isFreighterInstalled: boolean;
}

/**
 * Check if Freighter browser extension is installed
 */
export async function checkFreighterInstalled(): Promise<boolean> {
  try {
    const res = await isConnected();
    return res && res.isConnected ? true : false;
  } catch {
    return false;
  }
}

/**
 * Connect to Freighter wallet and retrieve user public key
 */
export async function connectFreighterWallet(): Promise<{ publicKey: string; network: string } | null> {
  try {
    const installed = await checkFreighterInstalled();
    if (!installed) {
      throw new Error('Freighter wallet extension not found. Please install Freighter from freighter.app.');
    }

    const access = await requestAccess();
    if (access.error || !access.address) {
      throw new Error(access.error || 'Access denied by user.');
    }

    let networkName = 'TESTNET';
    try {
      const net = await getNetwork();
      networkName = net.network || 'TESTNET';
    } catch {}

    return {
      publicKey: access.address,
      network: networkName,
    };
  } catch (error: any) {
    console.error('Freighter connection error:', error);
    throw error;
  }
}

/**
 * Fetch native XLM balance for given public key from Stellar Horizon Testnet
 */
export async function fetchAccountBalance(publicKey: string): Promise<string> {
  try {
    const res = await fetch(`${STELLAR_CONFIG.horizonUrl}/accounts/${publicKey}`);
    if (!res.ok) {
      if (res.status === 404) {
        return '0.00'; // Unfunded account
      }
      throw new Error('Failed to fetch account info');
    }
    const data = await res.json();
    const nativeBalance = data.balances.find((b: any) => b.asset_type === 'native');
    return nativeBalance
      ? parseFloat(nativeBalance.balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '0.00';
  } catch (error) {
    console.warn('Error fetching account balance:', error);
    return '0.00';
  }
}

/**
 * Request testnet funding from Stellar Friendbot
 */
export async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${STELLAR_CONFIG.friendbotUrl}?addr=${encodeURIComponent(publicKey)}`);
    return res.ok;
  } catch (error) {
    console.error('Friendbot request error:', error);
    return false;
  }
}

/**
 * Build, Sign, and Submit a REAL on-chain XLM Escrow Donation transaction to Stellar Testnet
 * Prompts the user's Freighter wallet extension to sign and broadcasts to Horizon.
 */
export async function executeStellarDonationTx(
  donorPublicKey: string,
  amountXLM: number,
  campaignId: string
): Promise<{ txHash: string; ledger: number }> {
  try {
    const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonUrl);

    // 1. Fetch current sequence number for donor account
    const account = await server.loadAccount(donorPublicKey);

    // 2. Build real payment transaction to the escrow destination with memo
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: STELLAR_CONFIG.escrowVaultAddress,
          asset: StellarSdk.Asset.native(),
          amount: amountXLM.toFixed(7),
        })
      )
      .addMemo(StellarSdk.Memo.text(`MSF:Camp#${campaignId}`.substring(0, 28)))
      .setTimeout(60)
      .build();

    const unsignedXdr = transaction.toXDR();

    // 3. Prompt user's Freighter wallet extension to sign
    const signResult = await signTransaction(unsignedXdr, {
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      address: donorPublicKey,
    });

    if (signResult.error || !signResult.signedTxXdr) {
      throw new Error(signResult.error || 'User rejected transaction in Freighter wallet.');
    }

    // 4. Submit signed transaction XDR to Stellar Horizon Testnet
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signResult.signedTxXdr,
      STELLAR_CONFIG.networkPassphrase
    ) as StellarSdk.Transaction;

    const result = await server.submitTransaction(signedTx);

    return {
      txHash: result.hash,
      ledger: result.ledger,
    };
  } catch (err: any) {
    console.error('Real Stellar transaction error:', err);
    // If Horizon returned an error with extras
    if (err?.response?.data?.extras?.result_codes) {
      const codes = err.response.data.extras.result_codes;
      throw new Error(`Stellar Horizon Error: ${codes.transaction || codes.operations?.join(', ')}`);
    }
    throw new Error(err.message || 'Failed to submit transaction to Stellar Testnet.');
  }
}
