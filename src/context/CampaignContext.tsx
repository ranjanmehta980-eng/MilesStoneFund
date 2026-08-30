'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign, DonationRecord, DonorVote, Milestone, PlatformMetrics } from '@/lib/types';
import { INITIAL_CAMPAIGNS, PLATFORM_METRICS } from '@/lib/mockData';
import { AnalyticsService } from '@/lib/analytics';
import { useWallet } from './WalletContext';

interface CampaignContextType {
  campaigns: Campaign[];
  metrics: PlatformMetrics;
  userDonations: DonationRecord[];
  userVotes: DonorVote[];
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'totalRaised' | 'totalReleased' | 'donorCount' | 'status' | 'currentMilestoneIndex'>) => Promise<string>;
  donateToCampaign: (campaignId: string, amount: number) => Promise<boolean>;
  submitMilestoneProof: (campaignId: string, milestoneIndex: number, proofData: { proofHash: string; proofTitle: string; proofDescription: string; proofMediaUrl?: string }) => Promise<boolean>;
  voteMilestone: (campaignId: string, milestoneIndex: number, approve: boolean) => Promise<boolean>;
  releaseMilestoneFunds: (campaignId: string, milestoneIndex: number) => Promise<boolean>;
  claimRefund: (campaignId: string) => Promise<number>;
  getCampaignById: (id: string) => Campaign | undefined;
  getUserBackedCampaigns: () => Campaign[];
  getUserCreatedCampaigns: () => Campaign[];
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const CAMPAIGNS_STORAGE_KEY = 'msf_campaigns_v1';
const DONATIONS_STORAGE_KEY = 'msf_donations_v1';
const VOTES_STORAGE_KEY = 'msf_votes_v1';

export function CampaignProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [userDonations, setUserDonations] = useState<DonationRecord[]>([]);
  const [userVotes, setUserVotes] = useState<DonorVote[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics>(PLATFORM_METRICS);

  // Load persisted data or default to INITIAL_CAMPAIGNS
  useEffect(() => {
    try {
      const storedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
      if (storedCampaigns) {
        setCampaigns(JSON.parse(storedCampaigns));
      } else {
        localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
      }

      const storedDonations = localStorage.getItem(DONATIONS_STORAGE_KEY);
      if (storedDonations) {
        setUserDonations(JSON.parse(storedDonations));
      }

      const storedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
      if (storedVotes) {
        setUserVotes(JSON.parse(storedVotes));
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, []);

  // Update dynamic metrics whenever campaigns state changes
  useEffect(() => {
    const totalVolume = campaigns.reduce((acc, c) => acc + c.totalRaised, 0);
    const activeEscrow = campaigns.reduce((acc, c) => acc + (c.totalRaised - c.totalReleased), 0);
    const completed = campaigns.filter((c) => c.status === 'Completed').length;
    const totalReleasedCount = campaigns.reduce(
      (acc, c) => acc + c.milestones.filter((m) => m.status === 'Released').length,
      0
    );
    const totalDonors = campaigns.reduce((acc, c) => acc + c.donorCount, 0);

    setMetrics({
      totalVolumeXLM: totalVolume,
      totalCampaigns: campaigns.length,
      successfulCampaigns: completed,
      activeEscrowXLM: activeEscrow,
      totalDonors: totalDonors,
      totalMilestonesReleased: totalReleasedCount,
    });
  }, [campaigns]);

  const saveCampaigns = (updated: Campaign[]) => {
    setCampaigns(updated);
    try {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save campaigns:', e);
    }
  };

  const createCampaign = async (
    data: Omit<Campaign, 'id' | 'createdAt' | 'totalRaised' | 'totalReleased' | 'donorCount' | 'status' | 'currentMilestoneIndex'>
  ): Promise<string> => {
    const newId = (campaigns.length + 1).toString();
    const newCampaign: Campaign = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      totalRaised: 0,
      totalReleased: 0,
      donorCount: 0,
      currentMilestoneIndex: 0,
      status: 'Active',
      milestones: data.milestones.map((m, idx) => ({
        ...m,
        index: idx,
        status: 'Pending',
        votesFor: 0,
        votesAgainst: 0,
      })),
      updates: [
        {
          id: 'u_' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          author: data.creatorName || 'Campaign Creator',
          title: 'Campaign Launched on Stellar!',
          content: 'We are thrilled to launch this milestone-based campaign on Stellar Soroban. Every XLM contributed is protected by smart contract escrow.',
          likes: 5,
        }
      ]
    };

    const updated = [newCampaign, ...campaigns];
    saveCampaigns(updated);

    AnalyticsService.logEvent('campaign_created', {
      userAddress: data.creator,
      campaignId: newId,
      amount: data.totalGoal,
    });

    return newId;
  };

  const donateToCampaign = async (campaignId: string, amount: number): Promise<boolean> => {
    if (!publicKey) throw new Error('Please connect your Freighter wallet');

    const updatedCampaigns = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        const newRaised = camp.totalRaised + amount;
        const isFunded = newRaised >= camp.totalGoal;
        return {
          ...camp,
          totalRaised: newRaised,
          donorCount: camp.donorCount + 1,
          status: isFunded ? ('Funded' as const) : camp.status,
        };
      }
      return camp;
    });

    saveCampaigns(updatedCampaigns);

    const newDonation: DonationRecord = {
      id: 'don_' + Date.now(),
      campaignId,
      donor: publicKey,
      amount,
      timestamp: new Date().toISOString(),
      transactionHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      refunded: false,
    };

    const updatedDonations = [newDonation, ...userDonations];
    setUserDonations(updatedDonations);
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(updatedDonations));

    AnalyticsService.logEvent('donation_confirmed', {
      userAddress: publicKey,
      campaignId,
      amount,
    });

    return true;
  };

  const submitMilestoneProof = async (
    campaignId: string,
    milestoneIndex: number,
    proofData: { proofHash: string; proofTitle: string; proofDescription: string; proofMediaUrl?: string }
  ): Promise<boolean> => {
    const updatedCampaigns = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        const updatedMilestones = camp.milestones.map((m, idx) => {
          if (idx === milestoneIndex) {
            return {
              ...m,
              proofHash: proofData.proofHash,
              proofTitle: proofData.proofTitle,
              proofDescription: proofData.proofDescription,
              proofMediaUrl: proofData.proofMediaUrl || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
              submittedAt: new Date().toISOString(),
              status: 'InReview' as const,
            };
          }
          return m;
        });

        const newUpdate = {
          id: 'u_' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          author: camp.creatorName || 'Creator',
          title: `Proof Submitted for Milestone ${milestoneIndex + 1}: ${proofData.proofTitle}`,
          content: proofData.proofDescription,
          likes: 2,
        };

        return {
          ...camp,
          milestones: updatedMilestones,
          updates: [newUpdate, ...(camp.updates || [])],
        };
      }
      return camp;
    });

    saveCampaigns(updatedCampaigns);

    AnalyticsService.logEvent('proof_submitted', {
      userAddress: publicKey || undefined,
      campaignId,
      milestoneIndex,
    });

    return true;
  };

  const voteMilestone = async (campaignId: string, milestoneIndex: number, approve: boolean): Promise<boolean> => {
    if (!publicKey) throw new Error('Please connect your Freighter wallet');

    // Calculate donor's total contribution weight
    const donorTotal = userDonations
      .filter((d) => d.campaignId === campaignId && d.donor === publicKey)
      .reduce((acc, d) => acc + d.amount, 0) || 500; // Default weight for testing if donor

    const updatedCampaigns = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        const updatedMilestones = camp.milestones.map((m, idx) => {
          if (idx === milestoneIndex) {
            const newVotesFor = approve ? m.votesFor + donorTotal : m.votesFor;
            const newVotesAgainst = !approve ? m.votesAgainst + donorTotal : m.votesAgainst;
            const quorum = camp.totalRaised / 2;
            const isApproved = newVotesFor > quorum;

            return {
              ...m,
              votesFor: newVotesFor,
              votesAgainst: newVotesAgainst,
              status: isApproved ? ('Approved' as const) : m.status,
            };
          }
          return m;
        });

        return {
          ...camp,
          milestones: updatedMilestones,
        };
      }
      return camp;
    });

    saveCampaigns(updatedCampaigns);

    const newVote: DonorVote = {
      campaignId,
      milestoneIndex,
      donor: publicKey,
      approved: approve,
      weight: donorTotal,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    const updatedVotes = [newVote, ...userVotes];
    setUserVotes(updatedVotes);
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(updatedVotes));

    AnalyticsService.logEvent('milestone_voted', {
      userAddress: publicKey,
      campaignId,
      milestoneIndex,
      amount: donorTotal,
      metadata: { approve },
    });

    return true;
  };

  const releaseMilestoneFunds = async (campaignId: string, milestoneIndex: number): Promise<boolean> => {
    const updatedCampaigns = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        const milestone = camp.milestones[milestoneIndex];
        if (!milestone) return camp;

        const updatedMilestones = camp.milestones.map((m, idx) => {
          if (idx === milestoneIndex) {
            return {
              ...m,
              status: 'Released' as const,
            };
          }
          return m;
        });

        const newReleased = camp.totalReleased + milestone.amount;
        const nextIndex = milestoneIndex + 1;
        const isComplete = nextIndex >= camp.milestones.length;

        return {
          ...camp,
          totalReleased: newReleased,
          currentMilestoneIndex: isComplete ? milestoneIndex : nextIndex,
          status: isComplete ? ('Completed' as const) : camp.status,
          milestones: updatedMilestones,
        };
      }
      return camp;
    });

    saveCampaigns(updatedCampaigns);

    AnalyticsService.logEvent('milestone_released', {
      userAddress: publicKey || undefined,
      campaignId,
      milestoneIndex,
    });

    return true;
  };

  const claimRefund = async (campaignId: string): Promise<number> => {
    if (!publicKey) throw new Error('Please connect your Freighter wallet');

    const donorContribution = userDonations
      .filter((d) => d.campaignId === campaignId && d.donor === publicKey && !d.refunded)
      .reduce((acc, d) => acc + d.amount, 0);

    if (donorContribution <= 0) {
      throw new Error('No refundable balance found for this wallet.');
    }

    const updatedDonations = userDonations.map((d) => {
      if (d.campaignId === campaignId && d.donor === publicKey) {
        return { ...d, refunded: true };
      }
      return d;
    });

    setUserDonations(updatedDonations);
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(updatedDonations));

    AnalyticsService.logEvent('refund_claimed', {
      userAddress: publicKey,
      campaignId,
      amount: donorContribution,
    });

    return donorContribution;
  };

  const getCampaignById = (id: string): Campaign | undefined => {
    return campaigns.find((c) => c.id === id);
  };

  const getUserBackedCampaigns = (): Campaign[] => {
    if (!publicKey) return [];
    const backedIds = new Set(
      userDonations
        .filter((d) => d.donor === publicKey)
        .map((d) => d.campaignId)
    );
    // If demo account, include campaign 1 & 2 for demo purposes
    if (backedIds.size === 0) {
      return campaigns.slice(0, 2);
    }
    return campaigns.filter((c) => backedIds.has(c.id));
  };

  const getUserCreatedCampaigns = (): Campaign[] => {
    if (!publicKey) return [];
    const created = campaigns.filter((c) => c.creator === publicKey);
    // If demo account and none created, show campaign 1 as creator
    if (created.length === 0) {
      return [campaigns[0]];
    }
    return created;
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        metrics,
        userDonations,
        userVotes,
        createCampaign,
        donateToCampaign,
        submitMilestoneProof,
        voteMilestone,
        releaseMilestoneFunds,
        claimRefund,
        getCampaignById,
        getUserBackedCampaigns,
        getUserCreatedCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
}
