'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Users, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Campaign } from '@/lib/types';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percentFunded = Math.min(Math.round((campaign.totalRaised / campaign.totalGoal) * 100), 100);
  const releasedMilestones = campaign.milestones.filter((m) => m.status === 'Released').length;
  const inReviewMilestones = campaign.milestones.filter((m) => m.status === 'InReview').length;

  const categoryColors: Record<string, string> = {
    'Green Tech': 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    Healthcare: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    Infrastructure: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    'Open Source': 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    DeFi: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
    Education: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
  };

  const statusBadges: Record<string, { label: string; class: string }> = {
    Active: { label: 'Funding Active', class: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    Funded: { label: 'Goal Met', class: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
    Completed: { label: 'All Milestones Done', class: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    Refunded: { label: 'Refund Active', class: 'bg-rose-950 text-rose-300 border-rose-800' },
  };

  return (
    <div className="group relative rounded-2xl bg-gray-900/70 border border-gray-800/90 hover:border-cyan-500/40 hover:shadow-[0_10px_35px_-10px_rgba(0,229,255,0.15)] transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Cover Image & Category Pill */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-950">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${categoryColors[campaign.category] || 'bg-gray-800 text-gray-200 border-gray-700'}`}>
            {campaign.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-md ${statusBadges[campaign.status]?.class}`}>
            {statusBadges[campaign.status]?.label}
          </span>
        </div>

        {/* Milestone Tracker Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-gray-200">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {releasedMilestones} of {campaign.milestones.length} Milestones Released
          </span>
          {inReviewMilestones > 0 && (
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse ml-1" title="Vote in review" />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator info */}
          <div className="flex items-center gap-2 mb-2">
            {campaign.creatorAvatar && (
              <img
                src={campaign.creatorAvatar}
                alt={campaign.creatorName}
                className="w-5 h-5 rounded-full object-cover border border-gray-700"
              />
            )}
            <span className="text-xs text-gray-400 truncate">
              {campaign.creatorName || `${campaign.creator.substring(0, 6)}...`}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5">
            {campaign.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {campaign.tagline}
          </p>
        </div>

        {/* Funding Metrics & Progress */}
        <div className="space-y-3 pt-3 border-t border-gray-800/80">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-cyan-400 font-bold font-mono text-sm">
                {campaign.totalRaised.toLocaleString()} XLM
              </span>
              <span className="text-gray-400">
                goal {campaign.totalGoal.toLocaleString()} XLM ({percentFunded}%)
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
          </div>

          {/* Footer Stats & CTA */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                {campaign.donorCount} backers
              </span>
            </div>

            <Link
              href={`/campaign/${campaign.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 hover:border-cyan-500 transition-all group-hover:translate-x-0.5"
            >
              <span>View Escrow</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
