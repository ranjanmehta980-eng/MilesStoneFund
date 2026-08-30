'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Compass, Sparkles } from 'lucide-react';
import { useCampaigns } from '@/context/CampaignContext';
import CampaignCard from '@/components/CampaignCard';
import { Campaign } from '@/lib/types';

export default function ExplorePage() {
  const { campaigns } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'raised' | 'backers'>('newest');

  const categories = ['All', 'Green Tech', 'Healthcare', 'Infrastructure', 'Open Source', 'DeFi', 'Education'];
  const statuses = ['All', 'Active', 'Funded', 'Completed'];

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'raised') return b.totalRaised - a.totalRaised;
        if (sortBy === 'backers') return b.donorCount - a.donorCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [campaigns, searchQuery, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="space-y-10 py-6">
      
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Decentralized Discovery</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Explore Trustless Milestone Campaigns
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Discover vetted initiatives where every donation is secured by Stellar Soroban smart contract escrow and released strictly on approved deliverables.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campaign title, keywords, or keywords..."
              className="w-full bg-gray-950 border border-gray-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-950 border border-gray-800 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-gray-200 outline-none"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="raised">Sort by: Most Raised (XLM)</option>
              <option value="backers">Sort by: Backer Count</option>
            </select>
          </div>
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-800/80">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-500 font-semibold mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-gray-950 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-semibold mr-1">Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-gray-900/30 rounded-3xl border border-gray-800">
          <p className="text-gray-400 text-sm">No campaigns match your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} />
          ))}
        </div>
      )}

    </div>
  );
}
