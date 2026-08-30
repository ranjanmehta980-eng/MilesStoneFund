'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, MessageSquare, Heart, Code2 } from 'lucide-react';
import { STELLAR_CONFIG } from '@/lib/stellar';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-[#070913] text-gray-400 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Platform Branding */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-heading font-black text-lg text-white">
                Milestone<span className="text-cyan-400">Fund</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Decentralized, milestone-based trustless crowdfunding protocol built on Stellar Soroban smart contracts. Funds are locked in verifiable escrow until community quorum release.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                Stellar Journey to Mastery Level 5 (Blue Belt)
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/explore" className="hover:text-cyan-400 transition-colors">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-cyan-400 transition-colors">
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link href="/creator" className="hover:text-cyan-400 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/donor" className="hover:text-cyan-400 transition-colors">
                  Donor Voting Portal
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-cyan-400 transition-colors">
                  On-Chain Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Stellar & Soroban Specs */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Stellar Soroban Specs</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="text-gray-500">Network:</span>
                <span className="text-gray-300 font-mono">Testnet</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-gray-500">Contract:</span>
                <span className="text-cyan-400 font-mono text-[11px] truncate max-w-[140px]" title={STELLAR_CONFIG.contractId}>
                  {STELLAR_CONFIG.contractId.substring(0, 8)}...
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-gray-500">Quorum:</span>
                <span className="text-gray-300 font-semibold">&gt;50% Donated Weight</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-gray-500">Escrow:</span>
                <span className="text-emerald-400">Non-custodial Pro-Rata</span>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Soroban Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Feedback */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">User Feedback & Community</h4>
            <p className="text-xs text-gray-400 mb-3">
              Help us test and refine MilestoneFund for Stellar mainnet launch!
            </p>
            <div className="space-y-2">
              <a
                href="https://docs.google.com/forms"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Submit User Feedback Form
              </a>
              <a
                href="https://github.com/ranjanmehta980-eng/MilesStoneFund"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-medium transition-all"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 MilestoneFund. Built with Rust, Soroban & Next.js for Stellar Master Build.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="flex items-center gap-1 text-gray-400">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the Stellar Ecosystem
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
