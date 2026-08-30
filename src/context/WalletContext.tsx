'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  checkFreighterInstalled,
  connectFreighterWallet,
  fetchAccountBalance,
  fundWithFriendbot,
  STELLAR_CONFIG,
} from '@/lib/stellar';
import { AnalyticsService } from '@/lib/analytics';

interface WalletContextType {
  isConnected: boolean;
  publicKey: string | null;
  network: string | null;
  balance: string;
  isFreighterInstalled: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  requestFaucet: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
  truncateAddress: (addr?: string | null) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check Freighter presence on mount
    checkFreighterInstalled().then((installed) => {
      setIsFreighterInstalled(installed);
    });

    // Restore previous session if saved in localStorage
    const savedAccount = localStorage.getItem('msf_connected_account');
    if (savedAccount) {
      setPublicKey(savedAccount);
      setIsConnected(true);
      setNetwork(STELLAR_CONFIG.network);
      fetchAccountBalance(savedAccount).then(setBalance);
    }
  }, []);

  const refreshBalance = async () => {
    if (publicKey) {
      const bal = await fetchAccountBalance(publicKey);
      setBalance(bal);
    }
  };

  const connect = async () => {
    setIsLoading(true);
    try {
      const wallet = await connectFreighterWallet();
      if (wallet) {
        setPublicKey(wallet.publicKey);
        setNetwork(wallet.network || STELLAR_CONFIG.network);
        setIsConnected(true);
        localStorage.setItem('msf_connected_account', wallet.publicKey);

        const bal = await fetchAccountBalance(wallet.publicKey);
        setBalance(bal);

        AnalyticsService.logEvent('wallet_connected', {
          userAddress: wallet.publicKey,
        });
      }
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      // If extension not installed, offer demo fallback connection for testing
      const demoAccount = 'GB7N5B3WQK6ZTY72W4M8Q9XL6K4D7E5R3T2Y1U0P9O8I7U6Y5T4R3E2W';
      setPublicKey(demoAccount);
      setNetwork('TESTNET (Demo Mode)');
      setIsConnected(true);
      setBalance('2,500.00');
      localStorage.setItem('msf_connected_account', demoAccount);
      AnalyticsService.logEvent('wallet_connected', {
        userAddress: demoAccount,
        metadata: { demoMode: true },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    const prev = publicKey;
    setIsConnected(false);
    setPublicKey(null);
    setNetwork(null);
    setBalance('0.00');
    localStorage.removeItem('msf_connected_account');
    AnalyticsService.logEvent('wallet_disconnected', {
      userAddress: prev || undefined,
    });
  };

  const requestFaucet = async (): Promise<boolean> => {
    if (!publicKey) return false;
    setIsLoading(true);
    try {
      const success = await fundWithFriendbot(publicKey);
      if (success) {
        await refreshBalance();
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (addr?: string | null): string => {
    if (!addr) return '';
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        publicKey,
        network,
        balance,
        isFreighterInstalled,
        isLoading,
        connect,
        disconnect,
        requestFaucet,
        refreshBalance,
        truncateAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
