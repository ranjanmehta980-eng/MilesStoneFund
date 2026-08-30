#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env, String, Vec,
};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> (token::Client<'a>, token::StellarAssetClient<'a>) {
    let contract_address = e.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(e, &contract_address.address()),
        token::StellarAssetClient::new(e, &contract_address.address()),
    )
}

#[test]
fn test_full_campaign_milestone_workflow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, MilestoneFundContract);
    let client = MilestoneFundContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let (token_client, token_admin) = create_token_contract(&env, &admin);

    let creator = Address::generate(&env);
    let donor1 = Address::generate(&env);
    let donor2 = Address::generate(&env);

    // Mint tokens to donors
    token_admin.mint(&donor1, &1000_0000000);
    token_admin.mint(&donor2, &1000_0000000);

    // Prepare milestones: Milestone 1 = 600, Milestone 2 = 400. Total = 1000.
    let mut milestones = Vec::new(&env);
    milestones.push_back(MilestoneInput {
        description: String::from_str(&env, "Build Prototype Alpha"),
        amount: 600_0000000,
        deadline: 1000,
    });
    milestones.push_back(MilestoneInput {
        description: String::from_str(&env, "Mainnet Launch Beta"),
        amount: 400_0000000,
        deadline: 2000,
    });

    let campaign_id = client.create_campaign(
        &creator,
        &String::from_str(&env, "Decentralized Solar Grid"),
        &String::from_str(&env, "Clean energy microgrid on Stellar"),
        &String::from_str(&env, "https://ipfs.io/ipfs/QmSolarGridCover"),
        &1000_0000000,
        &milestones,
        &token_client.address,
    );

    assert_eq!(campaign_id, 1);

    // Donors donate
    client.donate(&campaign_id, &donor1, &600_0000000);
    client.donate(&campaign_id, &donor2, &400_0000000);

    let campaign = client.get_campaign(&campaign_id);
    assert_eq!(campaign.total_raised, 1000_0000000);
    assert_eq!(campaign.donor_count, 2);
    assert_eq!(campaign.status, CampaignStatus::Funded);

    // Creator submits proof for Milestone 0
    client.submit_milestone_proof(
        &campaign_id,
        &0,
        &String::from_str(&env, "QmProofSolarAlphaHardwareTested"),
        &String::from_str(&env, "Hardware Test Logs on IPFS"),
    );

    // Donor 1 votes approve (weight 600 out of 1000 -> 60% > 50% Quorum)
    client.vote_milestone(&campaign_id, &0, &donor1, &true);

    // Milestone is released
    client.release_milestone_funds(&campaign_id, &0);

    // Verify creator received 600 tokens
    assert_eq!(token_client.balance(&creator), 600_0000000);

    let updated_campaign = client.get_campaign(&campaign_id);
    assert_eq!(updated_campaign.total_released, 600_0000000);
    assert_eq!(updated_campaign.current_milestone_index, 1);
}

#[test]
fn test_pro_rata_refund_when_milestone_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, MilestoneFundContract);
    let client = MilestoneFundContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let (token_client, token_admin) = create_token_contract(&env, &admin);

    let creator = Address::generate(&env);
    let donor1 = Address::generate(&env);
    let donor2 = Address::generate(&env);

    token_admin.mint(&donor1, &1000_0000000);
    token_admin.mint(&donor2, &1000_0000000);

    let mut milestones = Vec::new(&env);
    milestones.push_back(MilestoneInput {
        description: String::from_str(&env, "Milestone 1"),
        amount: 500_0000000,
        deadline: 500,
    });
    milestones.push_back(MilestoneInput {
        description: String::from_str(&env, "Milestone 2"),
        amount: 500_0000000,
        deadline: 1000,
    });

    let campaign_id = client.create_campaign(
        &creator,
        &String::from_str(&env, "Open Source Biotech"),
        &String::from_str(&env, "Accessible medicine research"),
        &String::from_str(&env, "https://ipfs.io/ipfs/QmBioCover"),
        &1000_0000000,
        &milestones,
        &token_client.address,
    );

    client.donate(&campaign_id, &donor1, &700_0000000);
    client.donate(&campaign_id, &donor2, &300_0000000);

    // Fast-forward time past deadline 500
    env.ledger().set_timestamp(600);

    // Donor 1 claims refund
    let refund1 = client.claim_refund(&campaign_id, &donor1);
    assert_eq!(refund1, 700_0000000);
    assert_eq!(token_client.balance(&donor1), 1000_0000000);

    // Donor 2 claims refund
    let refund2 = client.claim_refund(&campaign_id, &donor2);
    assert_eq!(refund2, 300_0000000);
    assert_eq!(token_client.balance(&donor2), 1000_0000000);
}
