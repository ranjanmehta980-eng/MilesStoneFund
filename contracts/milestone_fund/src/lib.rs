#![no_std]

use soroban_sdk::{
    contract, contractimpl, token, Address, Env, String, Vec,
};

mod events;
mod types;

#[cfg(test)]
mod test;

use events::*;
use types::*;

#[contract]
pub struct MilestoneFundContract;

#[contractimpl]
impl MilestoneFundContract {
    /// Initialize admin and configuration if needed
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CampaignCount, &0u64);
        Ok(())
    }

    /// Create a new milestone crowdfunding campaign
    pub fn create_campaign(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        image_url: String,
        total_goal: i128,
        milestones_input: Vec<MilestoneInput>,
        token: Address,
    ) -> Result<u64, Error> {
        creator.require_auth();

        if total_goal <= 0 {
            return Err(Error::InvalidGoal);
        }

        if milestones_input.is_empty() {
            return Err(Error::InvalidMilestone);
        }

        let mut milestone_sum: i128 = 0;
        let mut milestones: Vec<Milestone> = Vec::new(&env);

        let mut idx: u32 = 0;
        for m in milestones_input.iter() {
            if m.amount <= 0 {
                return Err(Error::InvalidMilestone);
            }
            milestone_sum += m.amount;
            milestones.push_back(Milestone {
                index: idx,
                description: m.description,
                amount: m.amount,
                deadline: m.deadline,
                proof_hash: String::from_str(&env, ""),
                proof_title: String::from_str(&env, ""),
                status: MilestoneStatus::Pending,
                votes_for: 0,
                votes_against: 0,
            });
            idx += 1;
        }

        if milestone_sum != total_goal {
            return Err(Error::InvalidGoal);
        }

        let campaign_count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::CampaignCount)
            .unwrap_or(0u64);
        let campaign_id = campaign_count + 1;

        let campaign = Campaign {
            id: campaign_id,
            creator: creator.clone(),
            title,
            description,
            image_url,
            total_goal,
            total_raised: 0,
            total_released: 0,
            donor_count: 0,
            milestones,
            current_milestone_index: 0,
            status: CampaignStatus::Active,
            created_at: env.ledger().timestamp(),
            token,
        };

        env.storage()
            .instance()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        env.storage()
            .instance()
            .set(&DataKey::CampaignCount, &campaign_id);

        let donor_list: Vec<Address> = Vec::new(&env);
        env.storage()
            .instance()
            .set(&DataKey::DonorList(campaign_id), &donor_list);

        emit_campaign_created(&env, campaign_id, &creator, total_goal, idx);

        Ok(campaign_id)
    }

    /// Donate funds into smart contract escrow for a campaign
    pub fn donate(
        env: Env,
        campaign_id: u64,
        donor: Address,
        amount: i128,
    ) -> Result<(), Error> {
        donor.require_auth();

        if amount <= 0 {
            return Err(Error::ZeroDonation);
        }

        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&DataKey::Campaign(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        if campaign.status != CampaignStatus::Active && campaign.status != CampaignStatus::Funded {
            return Err(Error::CampaignNotActive);
        }

        // Transfer tokens from donor into contract address
        let client = token::Client::new(&env, &campaign.token);
        client.transfer(&donor, &env.current_contract_address(), &amount);

        let previous_donation: i128 = env
            .storage()
            .instance()
            .get(&DataKey::DonorDonation(campaign_id, donor.clone()))
            .unwrap_or(0i128);

        if previous_donation == 0 {
            campaign.donor_count += 1;
            let mut donor_list: Vec<Address> = env
                .storage()
                .instance()
                .get(&DataKey::DonorList(campaign_id))
                .unwrap_or(Vec::new(&env));
            donor_list.push_back(donor.clone());
            env.storage()
                .instance()
                .set(&DataKey::DonorList(campaign_id), &donor_list);
        }

        let updated_donation = previous_donation + amount;
        env.storage().instance().set(
            &DataKey::DonorDonation(campaign_id, donor.clone()),
            &updated_donation,
        );

        campaign.total_raised += amount;
        if campaign.total_raised >= campaign.total_goal {
            campaign.status = CampaignStatus::Funded;
        }

        env.storage()
            .instance()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        emit_donation_received(&env, campaign_id, &donor, amount, campaign.total_raised);

        Ok(())
    }

    /// Creator submits milestone proof (IPFS hash and description)
    pub fn submit_milestone_proof(
        env: Env,
        campaign_id: u64,
        milestone_index: u32,
        proof_hash: String,
        proof_title: String,
    ) -> Result<(), Error> {
        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&DataKey::Campaign(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        campaign.creator.require_auth();

        if (milestone_index as usize) >= (campaign.milestones.len() as usize) {
            return Err(Error::IndexOutOfBounds);
        }

        let mut milestone = campaign.milestones.get(milestone_index).unwrap();

        if milestone.status != MilestoneStatus::Pending && milestone.status != MilestoneStatus::InReview {
            return Err(Error::MilestoneAlreadyApproved);
        }

        milestone.proof_hash = proof_hash.clone();
        milestone.proof_title = proof_title;
        milestone.status = MilestoneStatus::InReview;

        campaign.milestones.set(milestone_index, milestone);
        env.storage()
            .instance()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        emit_proof_submitted(&env, campaign_id, milestone_index, &proof_hash);

        Ok(())
    }

    /// Donors vote on milestone proof with weight proportional to their donation
    pub fn vote_milestone(
        env: Env,
        campaign_id: u64,
        milestone_index: u32,
        donor: Address,
        approve: bool,
    ) -> Result<(), Error> {
        donor.require_auth();

        let donor_donation: i128 = env
            .storage()
            .instance()
            .get(&DataKey::DonorDonation(campaign_id, donor.clone()))
            .unwrap_or(0i128);

        if donor_donation <= 0 {
            return Err(Error::NotDonor);
        }

        let has_voted: bool = env
            .storage()
            .instance()
            .has(&DataKey::DonorVote(campaign_id, milestone_index, donor.clone()));

        if has_voted {
            return Err(Error::AlreadyVoted);
        }

        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&DataKey::Campaign(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        if (milestone_index as usize) >= (campaign.milestones.len() as usize) {
            return Err(Error::IndexOutOfBounds);
        }

        let mut milestone = campaign.milestones.get(milestone_index).unwrap();

        if milestone.status != MilestoneStatus::InReview && milestone.status != MilestoneStatus::Pending {
            return Err(Error::MilestoneAlreadyApproved);
        }

        if approve {
            milestone.votes_for += donor_donation;
        } else {
            milestone.votes_against += donor_donation;
        }

        // Quorum check: if votes_for > 50% of total_raised
        let quorum_threshold = campaign.total_raised / 2;
        if milestone.votes_for > quorum_threshold {
            milestone.status = MilestoneStatus::Approved;
        }

        campaign.milestones.set(milestone_index, milestone);
        env.storage()
            .instance()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.storage().instance().set(
            &DataKey::DonorVote(campaign_id, milestone_index, donor.clone()),
            &approve,
        );

        emit_milestone_voted(
            &env,
            campaign_id,
            milestone_index,
            &donor,
            approve,
            donor_donation,
        );

        Ok(())
    }

    /// Release milestone funds to creator upon quorum approval
    pub fn release_milestone_funds(
        env: Env,
        campaign_id: u64,
        milestone_index: u32,
    ) -> Result<(), Error> {
        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&DataKey::Campaign(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        if (milestone_index as usize) >= (campaign.milestones.len() as usize) {
            return Err(Error::IndexOutOfBounds);
        }

        let mut milestone = campaign.milestones.get(milestone_index).unwrap();

        if milestone.status == MilestoneStatus::Released {
            return Err(Error::MilestoneAlreadyReleased);
        }

        // Auto-approve if quorum reached during release check
        let quorum_threshold = campaign.total_raised / 2;
        if milestone.votes_for > quorum_threshold {
            milestone.status = MilestoneStatus::Approved;
        }

        if milestone.status != MilestoneStatus::Approved {
            return Err(Error::QuorumNotReached);
        }

        milestone.status = MilestoneStatus::Released;
        campaign.total_released += milestone.amount;

        if milestone_index + 1 < campaign.milestones.len() {
            campaign.current_milestone_index = milestone_index + 1;
        } else {
            campaign.status = CampaignStatus::Completed;
        }

        campaign.milestones.set(milestone_index, milestone.clone());
        env.storage()
            .instance()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        // Transfer funds from contract escrow to creator
        let client = token::Client::new(&env, &campaign.token);
        client.transfer(
            &env.current_contract_address(),
            &campaign.creator,
            &milestone.amount,
        );

        emit_milestone_released(
            &env,
            campaign_id,
            milestone_index,
            milestone.amount,
            &campaign.creator,
        );

        Ok(())
    }

    /// Donors can claim pro-rata refund if milestone deadline breached without approval
    pub fn claim_refund(env: Env, campaign_id: u64, donor: Address) -> Result<i128, Error> {
        donor.require_auth();

        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&DataKey::Campaign(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        let donor_donation: i128 = env
            .storage()
            .instance()
            .get(&DataKey::DonorDonation(campaign_id, donor.clone()))
            .unwrap_or(0i128);

        if donor_donation <= 0 {
            return Err(Error::NotDonor);
        }

        let current_milestone = campaign
            .milestones
            .get(campaign.current_milestone_index)
            .ok_or(Error::IndexOutOfBounds)?;

        let current_time = env.ledger().timestamp();
        let is_deadline_passed = current_milestone.deadline > 0 && current_time > current_milestone.deadline;
        let is_unapproved = current_milestone.status != MilestoneStatus::Approved
            && current_milestone.status != MilestoneStatus::Released;

        if !is_deadline_passed || !is_unapproved {
            return Err(Error::RefundNotEligible);
        }

        campaign.status = CampaignStatus::Refunded;
        env.storage()
            .instance()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        // Calculate pro-rata remaining balance
        let remaining_pool = campaign.total_raised - campaign.total_released;
        if remaining_pool <= 0 {
            return Err(Error::RefundNotEligible);
        }

        let refund_amount = (donor_donation * remaining_pool) / campaign.total_raised;

        // Reset donor donation to prevent double refund
        env.storage()
            .instance()
            .set(&DataKey::DonorDonation(campaign_id, donor.clone()), &0i128);

        let client = token::Client::new(&env, &campaign.token);
        client.transfer(&env.current_contract_address(), &donor, &refund_amount);

        emit_refund_claimed(&env, campaign_id, &donor, refund_amount);

        Ok(refund_amount)
    }

    /// View function returning campaign status and all milestones
    pub fn get_campaign(env: Env, campaign_id: u64) -> Result<Campaign, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Campaign(campaign_id))
            .ok_or(Error::CampaignNotFound)
    }

    /// View total campaign count
    pub fn get_campaign_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::CampaignCount)
            .unwrap_or(0u64)
    }

    /// View donor total contribution to a campaign
    pub fn get_donor_donation(env: Env, campaign_id: u64, donor: Address) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::DonorDonation(campaign_id, donor))
            .unwrap_or(0i128)
    }
}
