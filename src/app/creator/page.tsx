'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  PlusCircle,
  FileCheck2,
  Lock,
  Coins,
  CheckCircle2,
  ExternalLink,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCampaigns } from '@/context/CampaignContext';
import { useWallet } from '@/context/WalletContext';
import ProofSubmissionModal from '@/components/ProofSubmissionModal';

export default function CreatorDashboardPage() {
  const { getUserCreatedCampaigns, releaseMilestoneFunds } = useCampaigns();
  const { isConnected, connect, publicKey, truncateAddress } = useWallet();

  const myCampaigns = getUserCreatedCampaigns();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [releaseStatus, setReleaseStatus] = useState<string | null>(null);

  const totalCreatedRaised = myCampaigns.reduce((sum, c) => sum + c.totalRaised, 0);
  const totalCreatedReleased = myCampaigns.reduce((sum, c) => sum + c.totalReleased, 0);
  const totalInEscrow = totalCreatedRaised - totalCreatedReleased;

  const handleOpenProof = (campaignId: string, milestoneIndex: number) => {
    setSelectedCampaignId(campaignId);
    setSelectedMilestoneIndex(milestoneIndex);
    setIsProofModalOpen(true);
  };

  const handleRelease = async (campaignId: string, milestoneIndex: number) => {
    try {
      await releaseMilestoneFunds(campaignId, milestoneIndex);
      setReleaseStatus(`Tranche #${milestoneIndex + 1} funds successfully released to your creator wallet!`);
    } catch (e: any) {
      setReleaseStatus(e.message || 'Release failed.');
    }
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Creator Operations Hub</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Creator Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your campaigns, upload IPFS proofs, and request tranche payouts.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs text-gray-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Campaign</span>
        </Link>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Raised</span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {totalCreatedRaised.toLocaleString()} XLM
          </div>
          <p className="text-[11px] text-gray-500">Across {myCampaigns.length} campaigns</p>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Locked in Escrow</span>
          <div className="text-2xl font-black font-mono text-indigo-400">
            {totalInEscrow.toLocaleString()} XLM
          </div>
          <p className="text-[11px] text-gray-500">Awaiting milestone proofs & votes</p>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Funds Disbursed</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {totalCreatedReleased.toLocaleString()} XLM
          </div>
          <p className="text-[11px] text-gray-500">Released to your Stellar account</p>
        </div>
      </div>

      {releaseStatus && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
          <span>{releaseStatus}</span>
          <button onClick={() => setReleaseStatus(null)} className="text-xs underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Campaigns Managed */}
      <div className="space-y-6">
        <h2 className="font-heading font-bold text-xl text-white">
          Active Campaigns Under Management
        </h2>

        {myCampaigns.length === 0 ? (
          <div className="p-12 text-center space-y-4 rounded-3xl bg-gray-900/30 border border-gray-800">
            <p className="text-gray-400 text-sm">You have not created any campaigns yet.</p>
            <Link
              href="/create"
              className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
            >
              Start Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {camp.category}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        Goal: {camp.totalGoal.toLocaleString()} XLM
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
                    <span>Public View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Milestone Action Tranches */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Milestone Progress & Payout Actions:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {camp.milestones.map((m, idx) => {
                      const quorumThreshold = camp.totalRaised / 2;
                      const hasQuorum = m.votesFor > quorumThreshold;

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-cyan-400">Tranche #{idx + 1}</span>
                              <span className="font-mono text-white font-semibold">
                                {m.amount.toLocaleString()} XLM
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2">{m.description}</p>
                            <p className="text-[10px] text-gray-500 mt-1">Status: <strong className="text-white">{m.status}</strong></p>
                          </div>

                          <div className="pt-2 border-t border-gray-800/80">
                            {m.status === 'Pending' && (
                              <button
                                onClick={() => handleOpenProof(camp.id, idx)}
                                className="w-full py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-gray-950 hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5"
                              >
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>Submit Proof</span>
                              </button>
                            )}

                            {m.status === 'InReview' && (
                              <div className="space-y-2">
                                <div className="text-[10px] text-amber-400 font-semibold text-center">
                                  Voting Live ({m.votesFor} / {quorumThreshold} XLM)
                                </div>
                                {hasQuorum && (
                                  <button
                                    onClick={() => handleRelease(camp.id, idx)}
                                    className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-gray-950 hover:bg-emerald-400 transition-all"
                                  >
                                    Claim Quorum Release
                                  </button>
                                )}
                              </div>
                            )}

                            {m.status === 'Approved' && (
                              <button
                                onClick={() => handleRelease(camp.id, idx)}
                                className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-gray-950 hover:bg-emerald-400 transition-all"
                              >
                                Claim Tranche ({m.amount.toLocaleString()} XLM)
                              </button>
                            )}

                            {m.status === 'Released' && (
                              <div className="text-center text-xs font-semibold text-emerald-400 py-1 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Disbursed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proof Submission Modal */}
      {selectedCampaignId && (
        <ProofSubmissionModal
          campaign={myCampaigns.find((c) => c.id === selectedCampaignId)!}
          milestoneIndex={selectedMilestoneIndex}
          isOpen={isProofModalOpen}
          onClose={() => setIsProofModalOpen(false)}
        />
      )}

    </div>
  );
}
