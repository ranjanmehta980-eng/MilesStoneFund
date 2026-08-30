import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';
import { CampaignProvider } from '@/context/CampaignContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MilestoneFund | Trustless Milestone-Based Crowdfunding on Stellar',
  description: 'A decentralized, milestone-based crowdfunding platform built on Stellar Soroban smart contracts. Funds are locked in verifiable escrow and released in tranches upon donor quorum voting.',
  keywords: ['Stellar', 'Soroban', 'Crowdfunding', 'Escrow', 'Smart Contracts', 'Web3', 'Blockchain', 'Freighter'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070913] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
        <WalletProvider>
          <CampaignProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
          </CampaignProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
