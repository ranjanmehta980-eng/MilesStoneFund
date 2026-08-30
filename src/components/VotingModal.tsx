'use client';

import React, { useState } from 'react';
import {
  X,
  Vote,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Campaign } from '@/lib/types';
import { useWallet } from '@/context/WalletContext';
import { useCampaigns } from '@/context/CampaignContext';
import { formatIpfsUrl } from '@/lib/ipfs';

interface VotingModalProps {
  campaign: Campaign;
  milestoneIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function VotingModal({ campaign, milestoneIndex, isOpen, onClose }: VotingModalProps) {
  const { isConnected, publicKey, connect } = useWallet();
  const { voteMilestone, userDonations } = useCampaigns();

  const [voteChoice, setVoteChoice] = useState<boolean | null>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [voteSuccess, setVoteSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const milestone = campaign.milestones[milestoneIndex];
  if (!milestone) return null;

  // Donor voting weight calculation
  const donorDonation = userDonations
    .filter((d) => d.campaignId === campaign.id && d.donor === publicKey)
    .reduce((acc, d) => acc + d.amount, 0) || 500; // Default weight for testing

  const handleVote = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    if (voteChoice === null) {
      setErrorMsg('Please select Approve or Reject.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await voteMilestone(campaign.id, milestoneIndex, voteChoice);
      setVoteSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Voting transaction failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-amber-500/30 p-6 md:p-8 shadow-2xl shadow-amber-950/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {voteSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">
              Vote Recorded on Soroban!
            </h3>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Your vote has been cast with a weighted power of{' '}
              <strong className="text-amber-400 font-mono">{donorDonation} XLM</strong> for Milestone #{milestoneIndex + 1}.
            </p>
            <button
              onClick={() => {
                setVoteSuccess(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-gray-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:shadow-lg transition-all"
            >
              Done & View Progress
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Vote className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Donor Governance & Voting
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Review Tranche #{milestoneIndex + 1}: {milestone.description}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tranche Release Value: <strong className="text-white font-mono">{milestone.amount.toLocaleString()} XLM</strong>
              </p>
            </div>

            {/* Proof Card Preview */}
            {milestone.proofHash && (
              <div className="p-4 rounded-2xl bg-gray-950/90 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Submitted Proof Artifact</span>
                  <a
                    href={formatIpfsUrl(milestone.proofHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                  >
                    <span>Inspect on IPFS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;{milestone.proofTitle || milestone.proofDescription}&rdquo;
                </p>
              </div>
            )}

            {/* Voting Weight Info */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Your Proportional Voting Weight:</span>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {donorDonation} XLM Power
              </span>
            </div>

            {/* Vote Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVoteChoice(true)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  voteChoice === true
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <ThumbsUp className="w-6 h-6" />
                <span className="font-bold text-sm">Approve Proof</span>
                <span className="text-[10px] text-gray-400">Release Tranche Funds</span>
              </button>

              <button
                type="button"
                onClick={() => setVoteChoice(false)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  voteChoice === false
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <ThumbsDown className="w-6 h-6" />
                <span className="font-bold text-sm">Reject Proof</span>
                <span className="text-[10px] text-gray-400">Require Revision</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Vote Action */}
            <button
              onClick={handleVote}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Vote to Stellar Testnet...</span>
              ) : !isConnected ? (
                <span>Connect Freighter to Vote</span>
              ) : (
                <span>Confirm {voteChoice ? 'Approval' : 'Rejection'} Vote ({donorDonation} XLM Weight)</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
