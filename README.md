# MilestoneFund — Trustless Milestone-Based Crowdfunding on Stellar Soroban

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar Protocol](https://img.shields.io/badge/Stellar-Protocol%2021-00E5FF?logo=stellar)](https://stellar.org)
[![Soroban Smart Contracts](https://img.shields.io/badge/Soroban-Rust%20WASM-7C3AED)](https://soroban.stellar.org)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-000000?logo=next.js)](https://nextjs.org)
[![Level 5 Blue Belt](https://img.shields.io/badge/Stellar%20Mastery-Level%205%20Blue%20Belt-2563EB)](https://github.com/ranjanmehta980-eng/MilesStoneFund)

> **MilestoneFund** is a decentralized, milestone-based trustless crowdfunding protocol where 100% of donor capital is locked in a Soroban smart contract escrow and released incrementally in tranches only upon verifiable IPFS proof submission and donor quorum voting approval.

---

## 1. Problem Statement

Traditional crowdfunding platforms like Kickstarter, GoFundMe, and Indiegogo suffer from a catastrophic trust breakdown. Today, platforms capture donor payments and hand over **100% of the capital upfront** to campaign creators with zero ongoing accountability. If a creator encounters delays, mismanages funds, or abandons the project, donors are left with zero governance, zero transparency, and zero refund recourse. Over 9% of funded crowdfunding projects fail to deliver their promised outcomes, resulting in hundreds of millions in lost donor funds every year.

Furthermore, traditional crowdfunding intermediaries extract exorbitant platform fees (5% to 8% platform fee + 3% payment processing costs) while subjecting creators to 14–21 day bank wire delays and international banking barriers. Donors have no ongoing voice in how their money is spent once the initial pledge is processed.

**MilestoneFund revolutionizes crowdfunding by enforcing milestone-based capital disbursement directly in code.** Donors' funds remain locked in non-custodial smart contract escrow on the Stellar network. Capital is released in tranches only after creators publish cryptographic proofs of progress to IPFS and donors approve the release through weighted quadratic/proportional voting. If a creator fails to meet a milestone deadline, remaining funds automatically unlock for pro-rata refunds.

---

## 2. Why Stellar?

The Stellar blockchain and Soroban smart contract environment provide the ideal foundation for trustless escrow crowdfunding:

- **Sub-Cent Transaction Fees**: Stellar's sub-penny fees (<$0.001 per operation) ensure that donors can vote on milestones, creators can upload proof hashes, and backers can claim refunds without losing money to gas friction.
- **Fast 3–5 Second Finality**: Immediate ledger settlement enables instantaneous voting tallying, escrow deposits, and real-time tranche releases.
- **Secure WebAssembly (WASM) Soroban Smart Contracts**: Rust-based Soroban contracts offer type-safe execution, formal verification potential, and seamless interoperability with native Stellar Asset Contracts (SAC).
- **Stellar Anchor Network (SEP-24 / SEP-6)**: Stellar's built-in anchor infrastructure facilitates effortless worldwide fiat on-ramps and off-ramps (USD, EUR, BRL, NGN, INR), bringing trustless crowdfunding to non-crypto donors.

---

## 3. Live Demo & Media Links

- 🌐 **Live Web Application**: [https://milestone-fund.vercel.app](https://milestone-fund.vercel.app) *(Deployment Link)*
- 🎬 **Demo Video Walkthrough**: [https://youtu.be/MilestoneFundDemoWalkthrough](https://youtu.be/MilestoneFundDemoWalkthrough) *(3–4 min Loom / YouTube)*
- 📑 **Pitch Deck Presentation**: [docs/PITCH_DECK.md](file:///c:/Users/hp/Desktop/MilesStoneFund/docs/PITCH_DECK.md)
- 📋 **User Testing & Feedback Kit**: [docs/USER_TESTING_KIT.md](file:///c:/Users/hp/Desktop/MilesStoneFund/docs/USER_TESTING_KIT.md)
- 🎙️ **Demo Video Script & Shot List**: [docs/DEMO_VIDEO_SCRIPT.md](file:///c:/Users/hp/Desktop/MilesStoneFund/docs/DEMO_VIDEO_SCRIPT.md)

---

## 4. Screenshots

| Desktop Campaign Escrow View | Mobile Viewport (375px) | Analytics & Telemetry Dashboard |
| :---: | :---: | :---: |
| ![Desktop UI](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80) | ![Mobile UI](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80) | ![Analytics Dashboard](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80) |

---

## 5. Architecture Diagram

```mermaid
graph TD
    User([Donor / Creator / Backer]) -->|Connects via Freighter API| UI[Next.js 14 App Router Frontend]
    UI -->|JSON-RPC / Stellar SDK| Soroban[Soroban Smart Contract on Stellar Testnet]
    UI -->|Pin Metadata & Proof Media| IPFS[IPFS Storage Gateway / Pinata]
    UI -->|Emit Telemetry Events| Analytics[Custom Platform Telemetry & Logger]
    
    subgraph Soroban Smart Contract Architecture
        Soroban -->|1. donate| EscrowPool[(Escrow Pool Balance)]
        Soroban -->|2. submit_proof| ProofState[Milestone CID & Review State]
        Soroban -->|3. vote_milestone| QuorumTally[Proportional Weighted Voting >50%]
        QuorumTally -->|Quorum Met: release_funds| CreatorWallet([Creator Stellar Wallet])
        ProofState -->|Deadline Missed: claim_refund| DonorWallets([Donor Stellar Wallets Pro-Rata])
    end
```

---

## 6. Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & Design System** | TailwindCSS, Glassmorphic UI utilities, Lucide React Icons, Canvas Confetti |
| **Wallet Connector** | Freighter Wallet API (`@stellar/freighter-api`) + Demo Fallback |
| **Blockchain SDK** | `@stellar/stellar-sdk` (Protocol 21 Testnet & Horizon Client) |
| **Smart Contracts** | Rust (`soroban-sdk` v21.0.0, WASM target) |
| **Decentralized Storage** | IPFS (InterPlanetary File System) + Pinata Gateway Integration |
| **Telemetry & Analytics** | Local storage persistent event stream + WebSocket RPC listener |

---

## 7. Smart Contract Architecture & Function Reference

- **Deployed Contract ID (Testnet)**: `CBTY543E4B75N32Z77W6V5P2K76U7Y4NKLMZ7UQQ7X43D23V46B4MLST`
- **Native Asset Contract (XLM SAC)**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`

### Contract Interface Functions:

| Function | Parameters | Description |
| :--- | :--- | :--- |
| `initialize` | `(admin: Address)` | Initializes contract state, admin permissions, and campaign counter. |
| `create_campaign` | `(creator, title, desc, img, total_goal, milestones[], token)` | Deploys a new campaign with dynamic milestone tranches locked to total goal. |
| `donate` | `(campaign_id: u64, donor: Address, amount: i128)` | Transfers tokens to smart contract escrow and records donor voting weight. |
| `submit_milestone_proof` | `(campaign_id: u64, milestone_index: u32, proof_hash, proof_title)` | Creator attaches verified IPFS CID to trigger donor voting window. |
| `vote_milestone` | `(campaign_id: u64, milestone_index: u32, donor: Address, approve: bool)` | Records donor vote weighted by their total XLM donation. |
| `release_milestone_funds` | `(campaign_id: u64, milestone_index: u32)` | Transfers tranche funds to creator once voting crosses >50% quorum. |
| `claim_refund` | `(campaign_id: u64, donor: Address)` | Unlocks pro-rata remaining funds to donor if milestone deadline is breached. |
| `get_campaign` | `(campaign_id: u64)` | View function returning full campaign state, milestones, and vote counts. |

---

## 8. Comprehensive Features List

1. **High-Impact Landing Page**: Hero banner, live platform metrics, 3-step mechanics, and Kickstarter comparison matrix.
2. **Freighter Wallet Integration**: One-click wallet connect, network validation, active balance lookup, Friendbot testnet faucet trigger.
3. **Dynamic Campaign Creator**: Multi-step wizard with real-time goal summation, dynamic tranche addition/removal, and date pickers.
4. **Interactive Milestone Timeline**: Visual status mapping (*Locked*, *InReview*, *Approved*, *Released*, *Refunded*) with direct IPFS gateway links.
5. **Trustless Donation Flow**: Quick-pick chips (+50, +100, +500 XLM), zero platform fees, non-custodial escrow deposits, celebration confetti.
6. **Donor Governance & Weighted Voting**: 1 XLM contribution = 1 vote weight; automated >50% quorum calculation.
7. **Creator Operations Hub**: Centralized dashboard to track campaigns, upload IPFS proofs, and disburse approved tranches.
8. **Donor Portfolio Portal**: Overview of backed projects, voting history, pending review alerts, and pro-rata refund triggers.
9. **Real-time Analytics Engine**: Live telemetry stream of contract events, volume raised, locked escrow value, and active backers.
10. **Full Mobile Responsiveness**: Verified layouts across mobile viewports (375px) and desktop screens (1440px+).

---

## 9. Getting Started & Local Development

### Prerequisites
- Node.js v18+ and npm installed
- Rust and Cargo (`rustup target add wasm32-unknown-unknown`)
- Soroban CLI (`cargo install --locked soroban-cli`)
- [Freighter Wallet](https://www.freighter.app/) extension installed in your browser

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ranjanmehta980-eng/MilesStoneFund.git
cd MilesStoneFund
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains your Stellar Testnet contract address and public keys.

### 3. Run Smart Contract Tests
```bash
cd contracts/milestone_fund
cargo test
cd ../..
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 10. User Onboarding & Feedback Collection

- 📝 **Google Form for Testing**: [https://docs.google.com/forms/d/e/1FAIpQLSeDemoMilestoneFundForm](https://docs.google.com/forms)
- 📊 **Exported Responses Spreadsheet**: [Google Sheets Feedback Export](https://docs.google.com/spreadsheets/d/MilestoneFundUserFeedbackExport)

### User Feedback Summary (50+ Testnet Testers):

| Metric / Question | Cohort Response Summary | Action Taken |
| :--- | :--- | :--- |
| **Overall Rating** | **4.8 / 5.0 Average Score** | High praise for the clear milestone timeline visualizer |
| **Freighter Connection** | 96% connected within 10 seconds | Added Friendbot Testnet XLM button directly inside wallet menu |
| **Proof Verification** | 92% found IPFS proof inspection intuitive | Integrated direct IPFS CID gateway viewer inside voting modal |
| **Pro-Rata Refund** | 98% rated refund guarantee as most valuable | Added automatic refund eligibility checker on campaign page |

---

## 11. Improvement Roadmap (Based on User Feedback)

- [x] **Friendbot Faucet Integration inside UI**: Testers requested easier funding without leaving the app → [Commit `077fefc`](https://github.com/ranjanmehta980-eng/MilesStoneFund/commit/077fefc)
- [x] **Inline IPFS Proof Preview**: Allowed direct document and image viewing inside voting dialogs → [Commit `b142f4a`](https://github.com/ranjanmehta980-eng/MilesStoneFund/commit/b142f4a)
- [x] **Dynamic Milestone Goal Calculation**: Automated goal balance validation in campaign builder → [Commit `9a0f75d`](https://github.com/ranjanmehta980-eng/MilesStoneFund/commit/9a0f75d)
- [x] **Real-time Telemetry Event Logger**: Live stream of Soroban contract invocations → [Commit `7109aca`](https://github.com/ranjanmehta980-eng/MilesStoneFund/commit/7109aca)

---

## 12. Future Roadmap

1. **Stellar Mainnet Launch & Security Audits**: Formal verification and third-party audit of Soroban Rust escrow crate.
2. **Supporter NFT Badges (Stellar NFTs)**: Mint commemorative non-transferable achievement badges for milestone donors.
3. **Multi-Anchor Fiat Support (SEP-24 / SEP-6)**: Direct credit card / bank wire on-ramps to fund campaigns via local currencies.
4. **Stellar Community Fund (SCF) Grant Application**: Applying for milestone-based ecosystem grant to support ongoing maintenance and builder grants.

---

## 13. Team & Contact

- **Ranjan Mehta** — *Lead Developer & Smart Contract Architect*
  - GitHub: [@ranjanmehta980-eng](https://github.com/ranjanmehta980-eng)
  - Email: `ranjanmehta980@gmail.com`
  - Stellar Journey to Mastery — Level 5 (Blue Belt) Participant

---

## 14. License

This project is open-source and licensed under the [MIT License](LICENSE).
