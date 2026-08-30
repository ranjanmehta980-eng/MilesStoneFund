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
  // Active, verified & funded Escrow Vault Account on Stellar Testnet
  escrowVaultAddress: 'GBSW6X4P5UBWU2GQCA57JDZ74A5WNBYOQJFPWLAKPS2GZBEYCNJKNCCD',
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
      throw new Error(access.error || 'Access denied by user in Freighter.');
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
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(publicKey)) {
      return '0.00';
    }

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
    // 1. Validate donor public key format
    if (!donorPublicKey || !StellarSdk.StrKey.isValidEd25519PublicKey(donorPublicKey)) {
      throw new Error('Invalid connected Stellar public key.');
    }

    const destination = STELLAR_CONFIG.escrowVaultAddress;
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(destination)) {
      throw new Error('Invalid Escrow Vault destination address.');
    }

    const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonUrl);

    // 2. Fetch donor account sequence from Horizon
    let account: any;
    try {
      account = await server.loadAccount(donorPublicKey);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        throw new Error('Your Stellar account is not funded on Testnet yet. Click Friendbot in the navbar to fund it with test XLM!');
      }
      throw err;
    }

    // 3. Build valid payment transaction with memo
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destination,
          asset: StellarSdk.Asset.native(),
          amount: amountXLM.toFixed(7),
        })
      )
      .addMemo(StellarSdk.Memo.text(`MSF:Camp#${campaignId}`.substring(0, 28)))
      .setTimeout(60)
      .build();

    const unsignedXdr = transaction.toXDR();

    // 4. Prompt user's Freighter wallet extension to sign
    const signResult = await signTransaction(unsignedXdr, {
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      address: donorPublicKey,
    });

    if (signResult.error || !signResult.signedTxXdr) {
      throw new Error(signResult.error || 'Transaction was cancelled in Freighter wallet.');
    }

    // 5. Submit signed transaction XDR to Stellar Horizon Testnet
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
    if (err?.response?.data?.extras?.result_codes) {
      const codes = err.response.data.extras.result_codes;
      throw new Error(`Stellar Horizon Error: ${codes.transaction || codes.operations?.join(', ')}`);
    }
    throw new Error(err.message || 'Failed to submit transaction to Stellar Testnet.');
  }
}
