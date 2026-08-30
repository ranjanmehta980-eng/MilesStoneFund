'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  Lock,
  ExternalLink,
  Vote,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Campaign, Milestone } from '@/lib/types';
import { formatIpfsUrl } from '@/lib/ipfs';

interface MilestoneTimelineProps {
  campaign: Campaign;
  onOpenVoting?: (milestoneIndex: number) => void;
  onOpenProofSubmission?: (milestoneIndex: number) => void;
  isCreator?: boolean;
  isDonor?: boolean;
}

export default function MilestoneTimeline({
  campaign,
  onOpenVoting,
  onOpenProofSubmission,
  isCreator,
  isDonor,
}: MilestoneTimelineProps) {
  const quorumThreshold = campaign.totalRaised / 2;

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'Released':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Funds Released
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
            <FileCheck2 className="w-3.5 h-3.5" />
            Quorum Approved
          </span>
        );
      case 'InReview':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse">
            <Vote className="w-3.5 h-3.5" />
            Voting in Progress
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            Refunded
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700">
            <Lock className="w-3.5 h-3.5" />
            Locked in Escrow
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Milestone Escrow Schedule
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Funds unlock tranche-by-tranche upon 50%+ community quorum approval on verifiable proofs.
          </p>
        </div>
      </div>

      <div className="relative border-l-2 border-gray-800 ml-4 md:ml-6 space-y-8 pl-6 md:pl-8">
        {campaign.milestones.map((milestone, idx) => {
          const isCurrent = idx === campaign.currentMilestoneIndex;
          const votePercentage = campaign.totalRaised > 0
            ? Math.min(Math.round((milestone.votesFor / campaign.totalRaised) * 100), 100)
            : 0;
          const quorumReached = milestone.votesFor > quorumThreshold;

          return (
            <div key={idx} className="relative group">
              
              {/* Timeline Bullet Point */}
              <div
                className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  milestone.status === 'Released'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-400'
                    : milestone.status === 'InReview'
                    ? 'bg-amber-950 border-amber-400 text-amber-400 animate-bounce'
                    : milestone.status === 'Approved'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-400'
                    : 'bg-gray-900 border-gray-700 text-gray-500'
                }`}
              >
                {milestone.status === 'Released' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : milestone.status === 'InReview' ? (
                  <Vote className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Milestone Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gray-900/90 border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.08)]'
                    : 'bg-gray-900/50 border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-cyan-400">
                        TRANCHE #{idx + 1}
                      </span>
                      {getStatusBadge(milestone.status)}
                    </div>
                    <h4 className="font-heading font-semibold text-base text-white">
                      {milestone.description}
                    </h4>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-mono font-bold text-white block">
                      {milestone.amount.toLocaleString()} XLM
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.round((milestone.amount / campaign.totalGoal) * 100)}% of total goal
                    </span>
                  </div>
                </div>

                {/* Proof Information Box if Available */}
                {milestone.proofHash && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-950/70 border border-gray-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-gray-200">
                          {milestone.proofTitle || 'Milestone Proof Submission'}
                        </span>
                      </div>
                      <a
                        href={formatIpfsUrl(milestone.proofHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline"
                      >
                        <span>IPFS: {milestone.proofHash.substring(0, 8)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {milestone.proofDescription && (
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {milestone.proofDescription}
                      </p>
                    )}

                    {milestone.proofMediaUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-gray-800 max-h-48 w-full">
                        <img
                          src={milestone.proofMediaUrl}
                          alt="Proof media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Voting Progress for InReview */}
                    {milestone.status === 'InReview' && (
                      <div className="pt-2 border-t border-gray-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">
                            Community Approval Quorum: <strong className="text-white">{votePercentage}%</strong> (Need &gt;50%)
                          </span>
                          <span className="text-cyan-400 font-mono">
                            {milestone.votesFor.toLocaleString()} / {quorumThreshold.toLocaleString()} XLM weight
                          </span>
                        </div>

                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              quorumReached ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${votePercentage}%` }}
                          />
                          {/* 50% Marker */}
                          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/40" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions / Trigger Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Target deadline: {new Date(milestone.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Creator Submit Proof Button */}
                    {isCreator && milestone.status === 'Pending' && isCurrent && (
                      <button
                        onClick={() => onOpenProofSubmission && onOpenProofSubmission(idx)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-gray-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        Submit Milestone Proof
                      </button>
                    )}

                    {/* Donor Vote Button */}
                    {milestone.status === 'InReview' && (
                      <button
                        onClick={() => onOpenVoting && onOpenVoting(idx)}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all flex items-center gap-1.5"
                      >
                        <Vote className="w-3.5 h-3.5" />
                        Cast Donor Vote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
