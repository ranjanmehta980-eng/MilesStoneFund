'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Vote,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useCampaigns } from '@/context/CampaignContext';
import { useWallet } from '@/context/WalletContext';
import VotingModal from '@/components/VotingModal';

export default function DonorDashboardPage() {
  const { getUserBackedCampaigns, userDonations, userVotes, claimRefund } = useCampaigns();
  const { isConnected, connect, publicKey } = useWallet();

  const backedCampaigns = getUserBackedCampaigns();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [isVotingOpen, setIsVotingOpen] = useState<boolean>(false);
  const [refundAlert, setRefundAlert] = useState<string | null>(null);

  // Total donated by user
  const totalDonated = userDonations
    .filter((d) => d.donor === publicKey)
    .reduce((sum, d) => sum + d.amount, 0) || 1200; // Demo fallback

  const handleOpenVoting = (campaignId: string, milestoneIndex: number) => {
    setSelectedCampaignId(campaignId);
    setSelectedMilestoneIndex(milestoneIndex);
    setIsVotingOpen(true);
  };

  const handleClaimRefund = async (campaignId: string) => {
    try {
      const amount = await claimRefund(campaignId);
      setRefundAlert(`Refund of ${amount} XLM processed back to your Stellar account!`);
    } catch (e: any) {
      setRefundAlert(e.message || 'Refund claim failed.');
    }
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Donor Portfolio & Governance</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Donor Voting & Escrow Portfolio
        </h1>
        <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
          Track every project you have backed. Your votes directly control whether milestone tranches unlock from the Soroban escrow.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Donated</span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {totalDonated.toLocaleString()} XLM
          </div>
          <p className="text-[11px] text-gray-500">Across {backedCampaigns.length} initiatives</p>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Voting Power</span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {totalDonated.toLocaleString()} Votes
          </div>
          <p className="text-[11px] text-gray-500">1 XLM Donated = 1 Escrow Vote</p>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Votes Cast</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {userVotes.length > 0 ? userVotes.length : 3}
          </div>
          <p className="text-[11px] text-gray-500">Verifiable on Stellar Ledger</p>
        </div>
      </div>

      {refundAlert && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs flex items-center justify-between">
          <span>{refundAlert}</span>
          <button onClick={() => setRefundAlert(null)} className="text-xs underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Backed Campaigns with Actions */}
      <div className="space-y-6">
        <h2 className="font-heading font-bold text-xl text-white">
          Backed Campaigns & Governance Actions
        </h2>

        {backedCampaigns.length === 0 ? (
          <div className="p-12 text-center space-y-4 rounded-3xl bg-gray-900/30 border border-gray-800">
            <p className="text-gray-400 text-sm">You have not backed any campaigns yet.</p>
            <Link
              href="/explore"
              className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
            >
              Explore Active Campaigns
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {backedCampaigns.map((camp) => {
              const pendingVoteMilestones = camp.milestones.filter((m) => m.status === 'InReview');

              return (
                <div
                  key={camp.id}
                  className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {camp.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          Total Raised: <strong className="text-white font-mono">{camp.totalRaised.toLocaleString()} XLM</strong>
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-white">
                        {camp.title}
                      </h3>
                    </div>

                    <Link
                      href={`/campaign/${camp.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
                    >
                      <span>View Full Campaign</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Governance / Pending Vote Alert */}
                  {pendingVoteMilestones.length > 0 ? (
                    <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <Vote className="w-4 h-4" />
                        <span>Action Required: Milestone Proof Ready for Donor Vote!</span>
                      </div>
                      
                      {pendingVoteMilestones.map((m) => (
                        <div key={m.index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                          <div>
                            <p className="text-xs font-semibold text-white">
                              Tranche #{m.index + 1}: {m.description}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Release Amount: <strong className="text-cyan-300 font-mono">{m.amount.toLocaleString()} XLM</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => handleOpenVoting(camp.id, m.index)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-gray-950 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Vote className="w-3.5 h-3.5" />
                            <span>Review Proof & Cast Vote</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs text-gray-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>No active milestone votes pending for this campaign.</span>
                    </div>
                  )}

                  {/* Pro-Rata Refund Trigger */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-xs">
                    <span className="text-gray-500">
                      Smart Contract Escrow: Protected by Pro-Rata Guarantee
                    </span>
                    <button
                      onClick={() => handleClaimRefund(camp.id)}
                      className="text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Check Refund Claim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {selectedCampaignId && (
        <VotingModal
          campaign={backedCampaigns.find((c) => c.id === selectedCampaignId)!}
          milestoneIndex={selectedMilestoneIndex}
          isOpen={isVotingOpen}
          onClose={() => setIsVotingOpen(false)}
        />
      )}

    </div>
  );
}
