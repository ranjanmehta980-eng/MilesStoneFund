use soroban_sdk::{contracterror, contracttype, Address, String, Vec};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    CampaignNotFound = 4,
    CampaignNotActive = 5,
    InvalidGoal = 6,
    InvalidMilestone = 7,
    DeadlinePassed = 8,
    DeadlineNotPassed = 9,
    MilestoneNotPending = 10,
    MilestoneNotInReview = 11,
    MilestoneNotApproved = 12,
    MilestoneAlreadyApproved = 13,
    MilestoneAlreadyReleased = 14,
    AlreadyVoted = 15,
    ZeroDonation = 16,
    NotDonor = 17,
    QuorumNotReached = 18,
    AlreadyRefunded = 19,
    RefundNotEligible = 20,
    IndexOutOfBounds = 21,
    ArithmeticOverflow = 22,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    InReview,
    Approved,
    Released,
    Refunded,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Active,
    Funded,
    Completed,
    Refunded,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MilestoneInput {
    pub description: String,
    pub amount: i128,
    pub deadline: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub index: u32,
    pub description: String,
    pub amount: i128,
    pub deadline: u64,
    pub proof_hash: String,
    pub proof_title: String,
    pub status: MilestoneStatus,
    pub votes_for: i128,
    pub votes_against: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub image_url: String,
    pub total_goal: i128,
    pub total_raised: i128,
    pub total_released: i128,
    pub donor_count: u32,
    pub milestones: Vec<Milestone>,
    pub current_milestone_index: u32,
    pub status: CampaignStatus,
    pub created_at: u64,
    pub token: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    CampaignCount,
    Campaign(u64),
    DonorList(u64),
    DonorDonation(u64, Address),
    DonorVote(u64, u32, Address),
    PlatformFeeBps,
    Admin,
}
