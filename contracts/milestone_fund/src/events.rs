use soroban_sdk::{symbol_short, Address, Env, String, Symbol};

pub fn emit_campaign_created(
    env: &Env,
    campaign_id: u64,
    creator: &Address,
    goal: i128,
    milestone_count: u32,
) {
    let topics = (symbol_short!("created"), campaign_id, creator.clone());
    env.events().publish(topics, (goal, milestone_count));
}

pub fn emit_donation_received(
    env: &Env,
    campaign_id: u64,
    donor: &Address,
    amount: i128,
    total_raised: i128,
) {
    let topics = (symbol_short!("donated"), campaign_id, donor.clone());
    env.events().publish(topics, (amount, total_raised));
}

pub fn emit_proof_submitted(
    env: &Env,
    campaign_id: u64,
    milestone_index: u32,
    proof_hash: &String,
) {
    let topics = (symbol_short!("proof_sub"), campaign_id, milestone_index);
    env.events().publish(topics, proof_hash.clone());
}

pub fn emit_milestone_voted(
    env: &Env,
    campaign_id: u64,
    milestone_index: u32,
    donor: &Address,
    approved: bool,
    weight: i128,
) {
    let topics = (symbol_short!("voted"), campaign_id, milestone_index);
    env.events().publish(topics, (donor.clone(), approved, weight));
}

pub fn emit_milestone_released(
    env: &Env,
    campaign_id: u64,
    milestone_index: u32,
    amount: i128,
    creator: &Address,
) {
    let topics = (symbol_short!("released"), campaign_id, milestone_index);
    env.events().publish(topics, (amount, creator.clone()));
}

pub fn emit_refund_claimed(
    env: &Env,
    campaign_id: u64,
    donor: &Address,
    amount: i128,
) {
    let topics = (symbol_short!("refunded"), campaign_id, donor.clone());
    env.events().publish(topics, amount);
}
