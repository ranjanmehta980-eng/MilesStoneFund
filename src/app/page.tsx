'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Vote,
  Coins,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Globe2,
  Users,
  Compass,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { useCampaigns } from '@/context/CampaignContext';
import { useWallet } from '@/context/WalletContext';
import CampaignCard from '@/components/CampaignCard';

export default function HomePage() {
  const { campaigns, metrics } = useCampaigns();
  const { isConnected, connect } = useWallet();

  const featuredCampaigns = campaigns.slice(0, 3);

  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-8 text-center md:text-left">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Stellar Journey to Mastery Level 5 • Soroban Smart Contract Escrow</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
              Crowdfunding Where <br className="hidden sm:block" />
              <span className="text-gradient">Trust is Guaranteed</span> by Code.
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Donations don't go directly to creators. Funds are locked in a non-custodial Soroban smart contract escrow and released in tranches <strong>only when verifiable milestone proofs are approved by donor voting</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-gray-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Campaigns</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/create"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-gray-200 bg-gray-900/90 border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch a Campaign</span>
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800/80">
              <div>
                <div className="text-2xl font-black font-mono text-cyan-400">
                  {metrics.totalVolumeXLM.toLocaleString()} XLM
                </div>
                <div className="text-xs text-gray-400">Total Volume Raised</div>
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-indigo-400">
                  {metrics.activeEscrowXLM.toLocaleString()} XLM
                </div>
                <div className="text-xs text-gray-400">Locked in Escrow</div>
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  100%
                </div>
                <div className="text-xs text-gray-400">Proof-Verified Releases</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-gray-900/90 to-gray-950/95 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">
                      Live Soroban Escrow State
                    </h3>
                    <p className="text-[11px] text-gray-400">Contract: Testnet Protocol v21</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ACTIVE
                </span>
              </div>

              {/* Interactive Step Preview */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Tranche 1: Hardware R&D</div>
                      <div className="text-[10px] text-gray-400">IPFS Proof CID #QmSolar...</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">5,000 XLM Released</span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-900 text-cyan-300 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-cyan-200">Tranche 2: Battery Assembly</div>
                      <div className="text-[10px] text-cyan-300/80">Quorum: 84% Approved (Need 50%)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">Voting Open</span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950/50 border border-gray-800/80 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-900 text-gray-500 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400">Tranche 3: Grid Activation</div>
                      <div className="text-[10px] text-gray-500">Locked until Milestone 2 approved</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-400">4,000 XLM Locked</span>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="pt-2 text-center">
                <p className="text-[11px] text-gray-400">
                  ⚡ 0% Platform Take • 100% Pro-Rata Automatic Refund Protection
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Smart Contract Mechanics</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
            How MilestoneFund Works
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            A 3-step trustless lifecycle that completely eliminates crowdfunding fraud, rug-pulls, and abandoned projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-cyan-500/40 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
              1
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              Funds Locked in Escrow
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When you donate, your XLM is securely deposited into the Soroban smart contract escrow account—not the creator's private wallet.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <Lock className="w-4 h-4" />
              <span>Non-custodial Protection</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-purple-500/40 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
              2
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              Creator Submits IPFS Proof
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The creator completes the milestone and publishes cryptographic proofs (test logs, bills of lading, GitHub release, photos) to IPFS and logs the CID on Stellar.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-purple-400">
              <FileCheck2 className="w-4 h-4" />
              <span>Decentralized Verification</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-emerald-500/40 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
              3
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              Donor Quorum Vote & Release
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Donors vote with power proportional to their contribution. If &gt;50% approve, the tranche is released. If deadline passes without approval, donors get an automatic pro-rata refund.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Vote className="w-4 h-4" />
              <span>Pro-Rata Refund Guarantee</span>
            </div>
          </div>

        </div>
      </section>

      {/* Comparison Section: Kickstarter vs MilestoneFund */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
            Traditional Crowdfunding vs. MilestoneFund
          </h2>
          <p className="text-xs text-gray-400">
            Why Web3 milestone escrow is the future of crowdfunding.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Feature</th>
                <th className="py-3 px-4 font-semibold text-rose-400">Kickstarter / GoFundMe</th>
                <th className="py-3 px-4 font-semibold text-cyan-400">MilestoneFund (Stellar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              <tr>
                <td className="py-4 px-4 font-medium text-white">Fund Disbursement</td>
                <td className="py-4 px-4 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  100% released upfront with zero accountability
                </td>
                <td className="py-4 px-4 text-cyan-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  Released in verified tranches via smart contract
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-white">Donor Protection</td>
                <td className="py-4 px-4 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  None; donors lose 100% if creator abandons
                </td>
                <td className="py-4 px-4 text-cyan-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  Automatic pro-rata refund on missed milestone deadlines
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-white">Platform Fees</td>
                <td className="py-4 px-4 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  5% to 8% platform take + 3% payment fees
                </td>
                <td className="py-4 px-4 text-cyan-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  0% platform fee, sub-cent Stellar transaction costs
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-white">Settlement Speed</td>
                <td className="py-4 px-4 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  14–21 business days bank wire delays
                </td>
                <td className="py-4 px-4 text-cyan-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  3–5 seconds finality on Stellar Testnet & Mainnet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Featured Campaigns Grid */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Curated Campaigns</span>
            </div>
            <h2 className="font-heading font-black text-3xl text-white">
              Featured Milestone Campaigns
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Explore live crowdfunding initiatives with verified milestone roadmaps.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCampaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} />
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative rounded-3xl p-10 md:p-16 bg-gradient-to-r from-cyan-950/80 via-indigo-950/80 to-purple-950/80 border border-cyan-500/40 text-center space-y-6 overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Ready to Build or Back on Stellar?
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Connect your Freighter wallet, test the Soroban escrow smart contracts on Testnet, and help shape the future of decentralized trustless funding.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/create"
              className="px-8 py-3.5 rounded-2xl font-bold text-sm text-gray-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all"
            >
              Start Your Milestone Campaign
            </Link>
            <Link
              href="/explore"
              className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-all"
            >
              Back Existing Projects
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
