import testnetDataJson from '../../docs/testnet_users_data.json';

export interface TestnetTransactionProof {
  User_ID: number;
  User_Name: string;
  User_Email: string;
  Stellar_Wallet_Address: string;
  Action_Type: string;
  Donated_Amount_XLM: number;
  Campaign_ID: number;
  Transaction_Hash: string;
  Ledger_Sequence: number;
  Timestamp: string;
  StellarExpert_Tx_URL: string;
  StellarExpert_Account_URL: string;
  User_Rating_Stars: number;
  Feedback_Review: string;
}

export const VERIFIED_TESTNET_PROOFS: TestnetTransactionProof[] = testnetDataJson as TestnetTransactionProof[];

export function getProofsForCampaign(campaignId: string | number): TestnetTransactionProof[] {
  const numId = typeof campaignId === 'string' ? parseInt(campaignId, 10) : campaignId;
  return VERIFIED_TESTNET_PROOFS.filter((p) => p.Campaign_ID === numId);
}
