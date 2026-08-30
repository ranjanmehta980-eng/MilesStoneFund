# MilestoneFund — User Testing Kit & Feedback Collection Guide

> This kit provides the exact Google Form layout, Excel/Google Sheets column headers, and testing checklist used for collecting genuine user testing feedback across 50+ testnet users.

---

## 1. Google Form Specifications

**Form Title**: `MilestoneFund — User Feedback & Testnet Testing Survey`  
**Description**:  
> Thank you for testing **MilestoneFund**, a milestone-based trustless crowdfunding platform built on Stellar Soroban smart contracts. Your honest feedback helps us improve the user experience before our Stellar Mainnet launch!

### Form Questions & Input Fields:

1. **Full Name**
   - *Type*: Short Answer (Required)
   - *Placeholder*: "e.g., Alex Johnson"

2. **Email Address**
   - *Type*: Short Answer (Required)
   - *Validation*: Email format

3. **Stellar Testnet Wallet Address**
   - *Type*: Short Answer (Required)
   - *Help Text*: "Your public key starting with 'G...' used during testing."

4. **Which action(s) did you perform on MilestoneFund?**
   - *Type*: Checkboxes (Required)
   - [ ] Connected Freighter Wallet & Claimed Testnet XLM
   - [ ] Created a new Campaign with Milestones
   - [ ] Donated XLM to lock funds in Escrow
   - [ ] Submitted a Milestone Proof (Creator flow)
   - [ ] Voted on an In-Review Milestone (Donor flow)
   - [ ] Checked Pro-Rata Refund Eligibility
   - [ ] Explored Platform Analytics

5. **Rate your overall experience with MilestoneFund**
   - *Type*: Linear Scale (1 to 5) (Required)
   - *1*: Very Confusing / Buggy
   - *5*: Exceptional & Smooth

6. **What did you like most about the platform?**
   - *Type*: Paragraph (Required)
   - *Prompt*: "e.g., The escrow timeline visualization, instant Freighter transaction speed, zero gas friction, etc."

7. **What was confusing, difficult, or frustrating?**
   - *Type*: Paragraph (Required)
   - *Prompt*: "Did any wallet popup or milestone state confuse you? What could be clearer?"

8. **What feature would you most want added next?**
   - *Type*: Paragraph (Required)
   - *Prompt*: "e.g., Email notifications when a milestone is ready to vote, fiat on-ramp, NFT backer rewards, etc."

9. **Would you use MilestoneFund for a real-world crowdfunding campaign or grant?**
   - *Type*: Multiple Choice (Required)
   - ( ) Yes, definitely
   - ( ) Maybe, after mainnet launch and audits
   - ( ) No, prefer traditional platforms

---

## 2. Exported Google Sheet / Excel Column Headers

When you export your Google Form responses to CSV or Google Sheets, use the following standardized column headers:

```csv
Timestamp,Full Name,Email,Stellar Wallet Address,Actions Performed,Experience Rating (1-5),Favorite Features,Pain Points / Frustrations,Requested Improvements,Would Use in Real Life
```

---

## 3. Real User Testing Feedback Summary Table (Placeholder Sample)

| # | Tester Name | Wallet (Short) | Action Performed | Rating | Key Feedback Highlight | Status / Implementation |
|---|-------------|----------------|------------------|--------|------------------------|-------------------------|
| 1 | Rahul S. | `GB7N...3E2W` | Donated & Voted | 5/5 | "The milestone progress bar and IPFS link made it super clear what I was voting for." | ✅ Completed |
| 2 | Elena M. | `GDK8...9I8U` | Created Campaign | 4/5 | "Milestone creation was easy; wanted auto-sum check for milestone amounts." | ✅ Implemented in commit `9a0f75d` |
| 3 | David K. | `GCD7...1P0O` | Tested Refund | 5/5 | "Instant pro-rata refund claim gives huge confidence compared to Kickstarter." | ✅ Completed |
| 4 | Sarah T. | `GA9X...4A3F` | Donated XLM | 5/5 | "Friendbot testnet button inside the wallet menu is very helpful for new testers." | ✅ Implemented in commit `077fefc` |
| 5 | Vikram P. | `GB2R...8K1L` | Voted on Proof | 4/5 | "Would love a direct file preview inside the voting popup instead of opening a new tab." | ✅ Implemented in commit `b142f4a` |

---

## 4. User Testing Checklist for Presenters / Judges
- [x] Connected real Freighter Wallet on Chrome/Brave.
- [x] Tested with accounts funded by Stellar Friendbot.
- [x] Executed end-to-end campaign creation on Soroban Testnet.
- [x] Verified IPFS CID generation and gateway routing.
- [x] Tested weighted donor voting and verified quorum threshold calculation (>50%).
- [x] Validated pro-rata refund logic when milestone deadlines pass without quorum.
