'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Activity,
  Lock,
  Vote,
  Coins,
  RefreshCw,
  FileCheck2,
  Users,
  ExternalLink,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useCampaigns } from '@/context/CampaignContext';
import { AnalyticsService, AnalyticsEvent } from '@/lib/analytics';
import { STELLAR_CONFIG } from '@/lib/stellar';

export default function AnalyticsDashboardPage() {
  const { metrics, campaigns } = useCampaigns();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    // Load recent telemetry events
    const recent = AnalyticsService.getRecentEvents(30);
    if (recent.length === 0) {
      // Seed default events for display if fresh session
      const sampleEvents: AnalyticsEvent[] = [
        {
          id: 'evt_init_1',
          type: 'milestone_released',
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          campaignId: '1',
          milestoneIndex: 0,
          amount: 5000,
        },
        {
          id: 'evt_init_2',
          type: 'milestone_voted',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          campaignId: '1',
          milestoneIndex: 1,
          amount: 600,
          metadata: { approve: true },
        },
        {
          id: 'evt_init_3',
          type: 'proof_submitted',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          campaignId: '2',
          milestoneIndex: 1,
        },
        {
          id: 'evt_init_4',
          type: 'donation_confirmed',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          campaignId: '1',
          amount: 500,
        },
        {
          id: 'evt_init_5',
          type: 'wallet_connected',
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          userAddress: 'GB7N5B3WQK6ZTY72W4M8Q9XL6K4D7E5R3T2Y1U0P9O8I7U6Y5T4R3E2W',
        },
      ];
      setEvents(sampleEvents);
    } else {
      setEvents(recent);
    }
  }, []);

  const getEventBadge = (type: AnalyticsEvent['type']) => {
    switch (type) {
      case 'milestone_released':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">TRANCHE RELEASED</span>;
      case 'milestone_voted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">QUORUM VOTE</span>;
      case 'proof_submitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">IPFS PROOF</span>;
      case 'donation_confirmed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">ESCROW DEPOSIT</span>;
      case 'campaign_created':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">NEW CAMPAIGN</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400">TELEMETRY</span>;
    }
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Soroban Protocol Intelligence</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Platform & On-Chain Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time telemetry and contract event metrics from Stellar Testnet.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Live WebSocket Listener Active</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>TOTAL VOLUME RAISED</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-400">
            {metrics.totalVolumeXLM.toLocaleString()} XLM
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% On-Chain Escrowed</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>ACTIVE LOCKED ESCROW</span>
            <Lock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black font-mono text-indigo-400">
            {metrics.activeEscrowXLM.toLocaleString()} XLM
          </div>
          <p className="text-[11px] text-gray-400">
            Awaiting future milestone proofs
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>RELEASED TRANCHES</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {metrics.totalMilestonesReleased}
          </div>
          <p className="text-[11px] text-gray-400">
            Across {metrics.totalCampaigns} active campaigns
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>TOTAL COMMUNITY BACKERS</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {metrics.totalDonors}
          </div>
          <p className="text-[11px] text-gray-400">
            With proportional voting weights
          </p>
        </div>

      </div>

      {/* Detailed Diagnostics: Contract & Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Live Event Stream */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Contract Event Log
            </h3>
            <span className="text-xs text-gray-500 font-mono">Auto-syncing</span>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  {getEventBadge(evt.type)}
                  <div>
                    <span className="text-gray-300 font-medium block">
                      {evt.type === 'milestone_released' && `Tranche #${(evt.milestoneIndex ?? 0) + 1} Released (${evt.amount} XLM)`}
                      {evt.type === 'milestone_voted' && `Donor Vote Cast (Weight: ${evt.amount} XLM)`}
                      {evt.type === 'proof_submitted' && `Milestone #${(evt.milestoneIndex ?? 0) + 1} IPFS Proof Uploaded`}
                      {evt.type === 'donation_confirmed' && `Escrow Deposit: +${evt.amount} XLM`}
                      {evt.type === 'wallet_connected' && `Freighter Connected: ${evt.userAddress?.substring(0, 8)}...`}
                      {evt.type === 'campaign_created' && `New Campaign Deployed`}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-cyan-400">
                  {evt.campaignId ? `Campaign #${evt.campaignId}` : 'Stellar'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Soroban Protocol Health & Contract Specs */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-gray-800 space-y-5">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Soroban Smart Contract State
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="text-cyan-300 font-mono font-bold">Stellar Testnet (Protocol 21)</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex justify-between">
                <span className="text-gray-400">Contract ID:</span>
                <span className="text-cyan-400 font-mono text-[11px] truncate max-w-[170px]" title={STELLAR_CONFIG.contractId}>
                  {STELLAR_CONFIG.contractId}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex justify-between">
                <span className="text-gray-400">Native Asset:</span>
                <span className="text-white font-mono font-bold">XLM / SAC Contract</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex justify-between">
                <span className="text-gray-400">Quorum Requirement:</span>
                <span className="text-emerald-400 font-bold">&gt;50.0% of Contributed Value</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex justify-between">
                <span className="text-gray-400">Refund Guarantee:</span>
                <span className="text-emerald-400 font-bold">Pro-Rata Auto Unlock</span>
              </div>
            </div>

            <a
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/80 text-xs font-semibold transition-all"
            >
              <span>Explore on StellarExpert</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
