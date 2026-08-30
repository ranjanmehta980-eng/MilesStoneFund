'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Coins,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Campaign } from '@/lib/types';
import { useWallet } from '@/context/WalletContext';
import { useCampaigns } from '@/context/CampaignContext';

interface DonateModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ campaign, isOpen, onClose }: DonateModalProps) {
  const { isConnected, publicKey, balance, connect } = useWallet();
  const { donateToCampaign } = useCampaigns();

  const [amount, setAmount] = useState<string>('100');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleDonate = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      await donateToCampaign(campaign.id, numAmount);
      setTxSuccess(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00E5FF', '#7C3AED', '#38BDF8', '#10B981'],
        });
      } catch {}

      setTimeout(() => {
        // Keep success view open for a moment
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction rejected or failed.');
    } finally {
      setIsProcessing(false);
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

        {txSuccess ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">
              Donation Locked in Escrow!
            </h3>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              You have successfully contributed <strong className="text-cyan-400 font-mono">{amount} XLM</strong>. Your funds are secured by the Soroban smart contract and will only be released with your milestone approval.
            </p>
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-xs font-mono text-gray-400 text-left">
              <div className="flex justify-between py-1">
                <span>Contract Escrow:</span>
                <span className="text-cyan-300">Soroban Testnet</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Voting Weight:</span>
                <span className="text-emerald-400">+{amount} Votes</span>
              </div>
            </div>
            <button
              onClick={() => {
                setTxSuccess(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-gray-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:shadow-lg transition-all"
            >
              Done & Return to Campaign
            </button>
          </div>
        ) : (
          /* Input Screen */
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Trustless Escrow Donation
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Back {campaign.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                100% of your funds are deposited directly into the campaign escrow contract.
              </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <label className="font-medium text-gray-300">Contribution Amount (XLM)</label>
                {isConnected && <span>Balance: {balance} XLM</span>}
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900/90 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-4 pr-16 text-xl font-mono font-bold text-white outline-none"
                  placeholder="100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-gray-400 text-sm">
                  XLM
                </span>
              </div>

              {/* Quick Pick Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      amount === q.toString()
                        ? 'bg-cyan-500 text-gray-950 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                        : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    +{q} XLM
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Contract Security Notice */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-cyan-300">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>How Your Contribution is Protected:</span>
              </div>
              <ul className="text-gray-300 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>Funds are locked in non-custodial Soroban smart contract.</li>
                <li>Released in tranches only upon 50%+ donor voting approval.</li>
                <li>Automatic pro-rata refund if project creator misses deadline.</li>
              </ul>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleDonate}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Signing Freighter Transaction...</span>
              ) : !isConnected ? (
                <span>Connect Freighter & Donate {amount} XLM</span>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Lock {amount} XLM in Escrow</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
