# MilestoneFund — Demo Video Script & Shot List (3–4 Minutes)

> **Format**: Video Recording Guide (Loom / OBS / Screen Recorder). Follow the timestamped cues and voiceover lines below.

---

### Segment 1: Intro & The Broken Trust Problem (0:00 – 0:30)
- **Screen View**: Landing Page Hero section (`/`) with animated background and live stats.
- **Voiceover**:
  > "Hi everyone! Welcome to MilestoneFund, a decentralized trustless crowdfunding platform built on Stellar with Soroban smart contracts.
  > Today, crowdfunding is fundamentally broken. Platforms like Kickstarter collect 100% of donor funds and hand them upfront to creators with zero accountability. If a creator walks away, donors lose everything.
  > MilestoneFund solves this by locking 100% of donated capital in a Soroban smart contract escrow, releasing funds only in tranches when creators submit verifiable milestone proofs and donors approve them through weighted governance."

---

### Segment 2: Wallet Connection & Campaign Discovery (0:30 – 1:00)
- **Screen View**: Clicking "Connect Freighter" button in Navbar, showing Freighter extension popup, balance updating, and navigating to `/explore`.
- **Voiceover**:
  > "Let's connect our Freighter wallet. Notice how our Stellar Testnet address and live XLM balance are instantly recognized. If you're a new tester, you can even request 10,000 testnet XLM directly from the Friendbot faucet inside our wallet menu.
  > On the Explore page, users can filter projects by category, funding status, or sorting metrics. Let's inspect the 'SolarGrid' initiative."

---

### Segment 3: Campaign Detail & Escrow Donation Flow (1:00 – 1:45)
- **Screen View**: Campaign detail page (`/campaign/1`), scrolling to the Milestone Escrow Timeline, opening "Back This Milestone Campaign" modal, picking 500 XLM, clicking donate, showing confetti.
- **Voiceover**:
  > "Here on the campaign page, every detail is crystal clear. We see the total raised, backers count, and most importantly, the interactive Milestone Escrow Timeline.
  > Notice that Tranche 1 has already been released after proof verification. Let's donate 500 XLM to support Tranche 2 and 3.
  > When we click 'Lock in Escrow', Freighter prompts us to sign the transaction. Once confirmed on Stellar Testnet, our funds are held in the contract and we receive 500 votes of governance weight."

---

### Segment 4: Creator Milestone Proof Submission (1:45 – 2:30)
- **Screen View**: Navigating to `/creator` dashboard, showing managed campaigns, clicking "Submit Proof" on a pending tranche, typing description, uploading media, and submitting.
- **Voiceover**:
  > "Now, switching to the Creator Hub. As a builder, I can't just take the money and run. To unlock Tranche 2, I must submit cryptographic proof of work.
  > I enter the proof title, attach our engineering test logs and photos, and submit. The platform automatically pins the metadata to IPFS and logs the CID on the Stellar smart contract, opening community voting."

---

### Segment 5: Donor Weighted Voting & Fund Release (2:30 – 3:15)
- **Screen View**: Switching to `/donor` dashboard, seeing the alert "Action Required: Milestone Proof Ready for Donor Vote!", opening Voting Modal, reviewing IPFS proof, clicking "Approve", showing quorum progress bar cross 50%, and showing the tranche funds release.
- **Voiceover**:
  > "Back on the Donor Voting Portal, backers receive instant notification. As a donor, I can inspect the raw IPFS proof document.
  > Because I donated 500 XLM, my vote carries 500 units of weight. I select 'Approve' and confirm on-chain.
  > Once the community crosses the 50% quorum threshold, the Soroban contract automatically allows the tranche release to the creator's wallet. If the deadline had passed without proof, I could click 'Claim Pro-Rata Refund' to withdraw my remaining funds."

---

### Segment 6: On-Chain Analytics & Conclusion (3:15 – 3:45)
- **Screen View**: Navigating to `/analytics` dashboard, highlighting live event stream, active escrow locked, contract ID, and returning to README.
- **Voiceover**:
  > "Finally, our Analytics Dashboard streams live on-chain contract events—from escrow deposits to milestone approvals.
  > MilestoneFund proves how Stellar and Soroban can make crowdfunding transparent, trustless, and fraud-proof.
  > Check out our open-source GitHub repository and submit your feedback via our testing form. Thank you!"

---

## Technical Recording Checklist:
- [ ] Screen resolution set to 1080p (1920x1080)
- [ ] Freighter wallet extension unlocked and funded on Stellar Testnet
- [ ] Audio crisp with minimal background noise
- [ ] Video exported in MP4/WebM format and uploaded to Loom or YouTube
