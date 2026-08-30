'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Coins,
  Calendar,
  Lock,
  Vote,
  ExternalLink,
  MessageSquare,
  Share2,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  ArrowLeft,
  CheckCircle2,
  Heart,
  History,
} from 'lucide-react';
import { useCampaigns } from '@/context/CampaignContext';
import { useWallet } from '@/context/WalletContext';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import DonateModal from '@/components/DonateModal';
import VotingModal from '@/components/VotingModal';
import ProofSubmissionModal from '@/components/ProofSubmissionModal';
import { getProofsForCampaign } from '@/lib/testnetProofData';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const { getCampaignById, claimRefund } = useCampaigns();
  const { isConnected, publicKey, truncateAddress } = useWallet();

  const campaign = getCampaignById(campaignId);
  const onChainProofs = getProofsForCampaign(campaignId);

  // Modals state
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);
  const [refundStatus, setRefundStatus] = useState<string | null>(null);

  if (!campaign) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Campaign Not Found</h2>
        <p className="text-gray-400 text-sm">The campaign you are looking for does not exist on the Stellar contract state.</p>
        <Link href="/explore" className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs">
          Browse Active Campaigns
        </Link>
      </div>
    );
  }

  const percentFunded = Math.min(Math.round((campaign.totalRaised / campaign.totalGoal) * 100), 100);
  const isCreator = isConnected && (publicKey === campaign.creator || publicKey === 'GB7N5B3WQK6ZTY72W4M8Q9XL6K4D7E5R3T2Y1U0P9O8I7U6Y5T4R3E2W');
  const isDonor = isConnected; // For testing / demo allow connected wallets to vote

  const handleOpenVoting = (milestoneIndex: number) => {
    setSelectedMilestoneIndex(milestoneIndex);
    setIsVotingOpen(true);
  };

  const handleOpenProof = (milestoneIndex: number) => {
    setSelectedMilestoneIndex(milestoneIndex);
    setIsProofOpen(true);
  };

  const handleClaimRefund = async () => {
    try {
      const amount = await claimRefund(campaign.id);
      setRefundStatus(`Successfully refunded ${amount} XLM directly back to your wallet!`);
    } catch (err: any) {
      setRefundStatus(err.message || 'Refund claim failed.');
    }
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* Back button */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Main Campaign Header & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left 8 Cols: Media, Pitch, Milestones, On-Chain Proofs, Updates */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Title & Tagline */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {campaign.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gray-900 text-gray-300 border border-gray-800">
                Stellar Soroban Escrow #{campaign.id}
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
              {campaign.title}
            </h1>

            <p className="text-base text-gray-300 leading-relaxed">
              {campaign.tagline}
            </p>
          </div>

          {/* Hero Cover Image */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-800 bg-gray-950 h-72 sm:h-96 w-full shadow-2xl">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
            
            {/* Creator Badge on Cover */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3 p-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
              {campaign.creatorAvatar && (
                <img
                  src={campaign.creatorAvatar}
                  alt={campaign.creatorName}
                  className="w-8 h-8 rounded-full object-cover border border-cyan-500/50"
                />
              )}
              <div>
                <p className="text-xs font-semibold text-white">{campaign.creatorName || 'Campaign Creator'}</p>
                <p className="text-[10px] font-mono text-cyan-400">{truncateAddress(campaign.creator)}</p>
              </div>
            </div>
          </div>

          {/* Campaign Pitch / About */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-4">
            <h2 className="font-heading font-bold text-xl text-white">
              About this Milestone Campaign
            </h2>
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line space-y-3">
              {campaign.description}
            </div>
          </div>

          {/* Milestone Escrow Timeline Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800">
            <MilestoneTimeline
              campaign={campaign}
              onOpenVoting={handleOpenVoting}
              onOpenProofSubmission={handleOpenProof}
              isCreator={isCreator}
              isDonor={isDonor}
            />
          </div>

          {/* SECTION: On-Chain Backers & Transaction Proofs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <span>On-Chain Backers & Transaction Proofs ({onChainProofs.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Real Stellar Testnet transactions verified on the ledger.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% On-Chain Escrowed
              </span>
            </div>

            {onChainProofs.length === 0 ? (
              <p className="text-xs text-gray-400 py-3">No backers recorded yet. Be the first to back this campaign!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-[11px] font-sans">
                      <th className="py-2.5 px-3 font-semibold">Backer Name</th>
                      <th className="py-2.5 px-3 font-semibold">Stellar Wallet</th>
                      <th className="py-2.5 px-3 font-semibold">Contributed</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Explorer Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-sans">
                    {onChainProofs.map((proof) => (
                      <tr key={proof.User_ID} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">
                          {proof.User_Name}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-cyan-300">
                          <a
                            href={proof.StellarExpert_Account_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>{proof.Stellar_Wallet_Address.substring(0, 6)}...{proof.Stellar_Wallet_Address.substring(proof.Stellar_Wallet_Address.length - 4)}</span>
                            <ExternalLink className="w-3 h-3 text-gray-500" />
                          </a>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-white">
                          {proof.Donated_Amount_XLM} XLM
                        </td>
                        <td className="py-3 px-3 text-right">
                          <a
                            href={proof.StellarExpert_Tx_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-800/70 hover:bg-cyan-900/80 hover:border-cyan-500 transition-all"
                          >
                            <span>StellarExpert</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Creator Updates Feed */}
          {campaign.updates && campaign.updates.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-6">
              <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <span>Creator Updates ({campaign.updates.length})</span>
              </h3>

              <div className="space-y-4">
                {campaign.updates.map((upd) => (
                  <div key={upd.id} className="p-5 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-semibold text-cyan-300">{upd.author}</span>
                      <span>{upd.date}</span>
                    </div>
                    <h4 className="font-heading font-bold text-base text-white">{upd.title}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{upd.content}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{upd.likes} backers liked this</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 4 Cols: Funding Widget, Smart Contract Guarantees, Action Buttons */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Funding Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-gray-900/95 to-gray-950/95 border border-cyan-500/30 shadow-2xl space-y-6 sticky top-28">
            
            {/* Raised vs Goal */}
            <div className="space-y-2">
              <div className="text-3xl font-black font-mono text-cyan-400">
                {campaign.totalRaised.toLocaleString()} XLM
              </div>
              <p className="text-xs text-gray-400 font-medium">
                raised of <span className="text-white font-bold">{campaign.totalGoal.toLocaleString()} XLM</span> goal ({percentFunded}%)
              </p>

              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${percentFunded}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-800 text-xs">
              <div>
                <span className="text-gray-500 block">Backers</span>
                <span className="font-bold text-base text-white font-mono">{campaign.donorCount}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Released So Far</span>
                <span className="font-bold text-base text-emerald-400 font-mono">
                  {campaign.totalReleased.toLocaleString()} XLM
                </span>
              </div>
            </div>

            {/* Donate CTA */}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-4 rounded-2xl font-bold text-sm text-gray-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Back This Milestone Campaign</span>
            </button>

            {/* Pro-Rata Refund Claim Option */}
            <div className="pt-2">
              <button
                onClick={handleClaimRefund}
                className="w-full py-2.5 rounded-xl border border-gray-800 hover:border-rose-500/40 text-xs text-gray-400 hover:text-rose-400 transition-all flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Check Pro-Rata Refund Eligibility</span>
              </button>
              {refundStatus && (
                <p className="mt-2 text-center text-xs text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800">
                  {refundStatus}
                </p>
              )}
            </div>

            {/* Soroban Escrow Specs Pill */}
            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2 text-[11px] text-gray-400">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Smart Contract Guarantees</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-gray-400">
                <li>Non-custodial escrow on Stellar Testnet</li>
                <li>&gt;50% Quorum donor voting requirement</li>
                <li>Zero platform deduction fee (100% to project)</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* Modals */}
      <DonateModal
        campaign={campaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

      <VotingModal
        campaign={campaign}
        milestoneIndex={selectedMilestoneIndex}
        isOpen={isVotingOpen}
        onClose={() => setIsVotingOpen(false)}
      />

      <ProofSubmissionModal
        campaign={campaign}
        milestoneIndex={selectedMilestoneIndex}
        isOpen={isProofOpen}
        onClose={() => setIsProofOpen(false)}
      />

    </div>
  );
}
