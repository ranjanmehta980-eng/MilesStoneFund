export type MilestoneStatus = 'Pending' | 'InReview' | 'Approved' | 'Released' | 'Refunded';

export type CampaignStatus = 'Active' | 'Funded' | 'Completed' | 'Refunded';

export interface Milestone {
  index: number;
  description: string;
  amount: number; // in XLM
  deadline: string; // ISO date string or timestamp
  proofHash?: string; // IPFS CID
  proofTitle?: string;
  proofDescription?: string;
  proofMediaUrl?: string;
  submittedAt?: string;
  status: MilestoneStatus;
  votesFor: number; // in XLM weight
  votesAgainst: number; // in XLM weight
}

export interface Campaign {
  id: string;
  creator: string; // Stellar public key
  creatorName?: string;
  creatorAvatar?: string;
  title: string;
  tagline: string;
  description: string;
  category: 'DeFi' | 'Infrastructure' | 'Green Tech' | 'Education' | 'Healthcare' | 'Open Source';
  imageUrl: string;
  totalGoal: number; // in XLM
  totalRaised: number; // in XLM
  totalReleased: number; // in XLM
  donorCount: number;
  milestones: Milestone[];
  currentMilestoneIndex: number;
  status: CampaignStatus;
  createdAt: string;
  tokenAddress?: string;
  contractId?: string;
  updates?: CampaignUpdate[];
}

export interface CampaignUpdate {
  id: string;
  date: string;
  author: string;
  title: string;
  content: string;
  likes: number;
}

export interface DonationRecord {
  id: string;
  campaignId: string;
  donor: string;
  amount: number;
  timestamp: string;
  transactionHash: string;
  refunded: boolean;
}

export interface DonorVote {
  campaignId: string;
  milestoneIndex: number;
  donor: string;
  approved: boolean;
  weight: number;
  timestamp: string;
  txHash: string;
}

export interface UserStats {
  totalDonated: number;
  campaignsBacked: number;
  votesCast: number;
  refundsClaimed: number;
}

export interface PlatformMetrics {
  totalVolumeXLM: number;
  totalCampaigns: number;
  successfulCampaigns: number;
  activeEscrowXLM: number;
  totalDonors: number;
  totalMilestonesReleased: number;
}
