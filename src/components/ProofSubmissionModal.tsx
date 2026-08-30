'use client';

import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { Campaign } from '@/lib/types';
import { useCampaigns } from '@/context/CampaignContext';
import { uploadProofToIpfs } from '@/lib/ipfs';

interface ProofSubmissionModalProps {
  campaign: Campaign;
  milestoneIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProofSubmissionModal({
  campaign,
  milestoneIndex,
  isOpen,
  onClose,
}: ProofSubmissionModalProps) {
  const { submitMilestoneProof } = useCampaigns();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [customCid, setCustomCid] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const milestone = campaign.milestones[milestoneIndex];
  if (!milestone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please fill in both title and description.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      // Generate or pin to IPFS
      let cid = customCid;
      if (!cid) {
        const ipfsResult = await uploadProofToIpfs(
          {
            campaignId: campaign.id,
            milestoneIndex,
            title,
            description,
            mediaUrl,
            timestamp: new Date().toISOString(),
          },
          title
        );
        cid = ipfsResult.cid;
      }

      await submitMilestoneProof(campaign.id, milestoneIndex, {
        proofHash: cid,
        proofTitle: title,
        proofDescription: description,
        proofMediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Proof submission failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-cyan-500/30 p-6 md:p-8 shadow-2xl shadow-cyan-950/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">
              Proof Published to IPFS & Soroban!
            </h3>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Your milestone proof is now live. Donors have been notified and voting is open for Tranche #{milestoneIndex + 1}.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-gray-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:shadow-lg transition-all"
            >
              Done & View Campaign Status
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Creator Milestone Verification
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Submit Proof for Tranche #{milestoneIndex + 1}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Target: <span className="text-gray-200">{milestone.description}</span> ({milestone.amount.toLocaleString()} XLM)
              </p>
            </div>

            {/* Proof Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Proof Title / Headline *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hardware Prototype V1 Bench Testing Log"
                className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            {/* Proof Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Detailed Proof Deliverables & Findings *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the results, links to GitHub commit/tag, test reports, or physical photos..."
                className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            {/* Proof Media URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Proof Image / Media URL (Optional)</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* Custom IPFS CID Override */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-gray-300">Custom IPFS CID (Optional)</label>
                <span className="text-gray-500">Auto-generated if empty</span>
              </div>
              <input
                type="text"
                value={customCid}
                onChange={(e) => setCustomCid(e.target.value)}
                placeholder="Qm..."
                className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs font-mono text-cyan-300 outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <span>Pinning to IPFS & Stellar Ledger...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Proof to Open Community Voting</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
