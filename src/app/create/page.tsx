'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Trash2,
  ShieldCheck,
  Calendar,
  Coins,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useCampaigns } from '@/context/CampaignContext';
import { Milestone } from '@/lib/types';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { isConnected, publicKey, connect } = useWallet();
  const { createCampaign } = useCampaigns();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'DeFi' | 'Infrastructure' | 'Green Tech' | 'Education' | 'Healthcare' | 'Open Source'>('Green Tech');
  const [imageUrl, setImageUrl] = useState('');
  const [creatorName, setCreatorName] = useState('');

  // Milestone Builder State
  const [milestones, setMilestones] = useState<Array<{ description: string; amount: string; deadline: string }>>([
    {
      description: 'Phase 1: Architecture & Initial Prototype',
      amount: '5000',
      deadline: '2026-09-30',
    },
    {
      description: 'Phase 2: Alpha Testing & Security Audit',
      amount: '5000',
      deadline: '2026-11-15',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate total goal dynamically from milestone amounts
  const totalGoal = milestones.reduce((sum, m) => {
    const val = parseFloat(m.amount);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        description: `Phase ${milestones.length + 1}: `,
        amount: '2500',
        deadline: '2026-12-31',
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, idx) => idx !== index));
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    (updated[index] as any)[field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      await connect();
      return;
    }

    if (!title.trim() || !tagline.trim() || !description.trim()) {
      setErrorMsg('Please complete all campaign details.');
      return;
    }

    if (totalGoal <= 0) {
      setErrorMsg('Total campaign goal must be greater than zero.');
      return;
    }

    for (let i = 0; i < milestones.length; i++) {
      if (!milestones[i].description.trim() || parseFloat(milestones[i].amount) <= 0) {
        setErrorMsg(`Milestone #${i + 1} has invalid description or amount.`);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
        index: idx,
        description: m.description,
        amount: parseFloat(m.amount),
        deadline: new Date(m.deadline).toISOString(),
        status: 'Pending',
        votesFor: 0,
        votesAgainst: 0,
      }));

      const newId = await createCampaign({
        creator: publicKey || 'GB7N5B3WQK6ZTY72W4M8Q9XL6K4D7E5R3T2Y1U0P9O8I7U6Y5T4R3E2W',
        creatorName: creatorName || 'Stellar Creator',
        creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        title,
        tagline,
        description,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        totalGoal,
        milestones: formattedMilestones,
      });

      router.push(`/campaign/${newId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize campaign on Soroban.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Soroban Milestone Escrow Builder</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Launch a Milestone-Backed Campaign
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Define your campaign goals and break down funding into verifiable milestone tranches. Backers retain governance power over every tranche.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Campaign Info */}
        <div className="p-6 md:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-6">
          <h2 className="font-heading font-bold text-lg text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            1. Campaign Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-300">Campaign Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next-Gen Decentralized Solar Microgrid"
                className="w-full bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-300">One-Line Tagline *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Short and punchy hook for donors..."
                className="w-full bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              >
                <option value="Green Tech">Green Tech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Open Source">Open Source</option>
                <option value="DeFi">DeFi</option>
                <option value="Education">Education</option>
              </select>
            </div>

            {/* Creator / Org Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Creator / Organization Name</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. SolarGrid DAO"
                className="w-full bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-300">Cover Image URL (or IPFS Gateway)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://ipfs.io/ipfs/..."
                className="w-full bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-300">Full Campaign Pitch & Architecture *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your vision, technical roadmap, and why backers can trust your milestone deliverables..."
                className="w-full bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Milestone Tranche Builder */}
        <div className="p-6 md:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div>
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-indigo-400" />
                2. Milestone Tranche Breakdown
              </h2>
              <p className="text-xs text-gray-400">
                Divide your total funding into specific verifiable milestones.
              </p>
            </div>

            {/* Total Sum Display */}
            <div className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Total Escrow Goal:</span>
              <span className="font-mono font-black text-cyan-300 text-base">{totalGoal.toLocaleString()} XLM</span>
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-gray-700 transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Tranche #{idx + 1}
                  </span>

                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Remove milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Milestone Description */}
                  <div className="md:col-span-6 space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Deliverable / Objective *</label>
                    <input
                      type="text"
                      required
                      value={milestone.description}
                      onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Hardware procurement and bench testing"
                      className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Tranche Amount */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Tranche Amount (XLM) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 outline-none"
                    />
                  </div>

                  {/* Deadline */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Target Deadline *</label>
                    <input
                      type="date"
                      required
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(idx, 'deadline', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddMilestone}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/40 text-xs font-bold text-gray-300 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Add Another Milestone Tranche</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl font-bold text-base text-gray-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Deploying Campaign to Soroban Testnet...</span>
          ) : !isConnected ? (
            <span>Connect Freighter & Launch Campaign</span>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Deploy Campaign Escrow ({totalGoal.toLocaleString()} XLM)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
