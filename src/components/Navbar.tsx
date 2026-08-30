'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Wallet,
  PlusCircle,
  Compass,
  BarChart3,
  UserCheck,
  Coins,
  ChevronDown,
  LogOut,
  ExternalLink,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected, publicKey, network, balance, isLoading, connect, disconnect, requestFaucet, truncateAddress } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Create Campaign', href: '/create', icon: PlusCircle },
    { name: 'Creator Hub', href: '/creator', icon: ShieldCheck },
    { name: 'Donor Portfolio', href: '/donor', icon: UserCheck },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const handleFaucet = async () => {
    setFaucetLoading(true);
    await requestFaucet();
    setFaucetLoading(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-[#0B0F19]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Milestone<span className="text-cyan-400">Fund</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-full">
                  SOROBAN
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Trustless Stellar Crowdfunding</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Wallet Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Testnet Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-800/50 text-indigo-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span>Stellar Testnet</span>
            </div>

            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-gray-900/90 border border-gray-700/70 hover:border-cyan-500/50 transition-all text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="text-left">
                    <div className="font-mono text-xs text-white font-medium">
                      {truncateAddress(publicKey)}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-semibold">
                      {balance} XLM
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111827] border border-gray-700 shadow-2xl p-3 z-50">
                    <div className="p-2 border-b border-gray-800 mb-2">
                      <p className="text-xs text-gray-400">Connected Stellar Address</p>
                      <p className="font-mono text-xs text-cyan-300 break-all select-all mt-1">
                        {publicKey}
                      </p>
                    </div>

                    <button
                      onClick={handleFaucet}
                      disabled={faucetLoading}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-gray-200 hover:bg-gray-800/80 rounded-lg transition-colors mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        {faucetLoading ? 'Requesting Testnet XLM...' : 'Friendbot Faucet (+10k XLM)'}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    </button>

                    <a
                      href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:bg-gray-800/80 rounded-lg transition-colors mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                        View on StellarExpert
                      </span>
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isLoading}
                className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-900 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  {isLoading ? 'Connecting...' : 'Connect Freighter'}
                </span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 py-4 px-2 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-gray-800">
              {isConnected ? (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-900 rounded-lg text-xs font-mono text-cyan-400 flex justify-between">
                    <span>{truncateAddress(publicKey)}</span>
                    <span>{balance} XLM</span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="w-full py-2.5 text-center text-sm font-medium text-red-400 bg-red-950/20 rounded-lg"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center text-sm font-semibold text-gray-900 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-xl"
                >
                  Connect Freighter Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
