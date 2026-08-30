import testnetDataJson from '../../docs/testnet_users_data.json';

export interface TestnetTransactionProof {
  ID: number;
  Stellar_Wallet_Address: string;
  Campaign_ID: number;
  Donated_Amount_XLM: number;
  Transaction_Hash: string;
  StellarExpert_Tx_URL: string;
  StellarExpert_Account_URL: string;
}

export const VERIFIED_TESTNET_PROOFS: TestnetTransactionProof[] = testnetDataJson as TestnetTransactionProof[];

export function getProofsForCampaign(campaignId: string | number): TestnetTransactionProof[] {
  const numId = typeof campaignId === 'string' ? parseInt(campaignId, 10) : campaignId;
  return VERIFIED_TESTNET_PROOFS.filter((p) => p.Campaign_ID === numId);
}
