1. Project Objective and Scope

The objective of this project is to develop a controllable and reportable discount and credit system that operates on top of existing VIP warranty cards.
This system adds a layer of incentive-based discount and credit logic without modifying the core financial structure.

2. Operational Scenarios
   Scenario 1 – Standard Warranty Card Registration Reward

After a standard warranty card is successfully registered, the system checks:

Whether the reward rule is active

Whether this card has already received a reward

If approved, a predefined credit amount is added to the user’s VIP card.

The transaction is recorded in the Ledger.

Scenario 2 – Corporate Discount Code

A shared discount code is defined for an organization.

The code has both a global usage limit and a per-user usage limit.

It is applicable only to VIP card purchases.

3. Backend Implementation Details (NestJS)
   3.1 Module Structure

VipModule (existing)

VipLedgerModule (new)

DiscountModule

RewardRuleModule

3.2 Warranty Registration Reward Logic

Event hook on warranty card registration

Duplicate prevention (via unique constraints or validation logic)

Transaction logging and VIP credit increment

3.3 Discount Codes

DiscountCode table

DiscountCodeUsage table

Concurrency control to prevent overuse

Full validation before payment

3.4 Discount Engine

Application order: discount code first, then VIP credit

Final price calculation

Testable and extensible design

4. Admin Panel
   4.1 Reward Rule Management

Define reward amount

Enable / disable rules

Set active time ranges

4.2 Discount Code Management

Create corporate discount codes

Define total capacity and per-user limits

Usage and consumption reports

4.3 User Credit Management

Manual credit increase/decrease with reason logging

5. Risks and Controls

Prevent concurrent overuse of discount codes

Log all changes in the Ledger

Prevent duplicate rewards for the same warranty card

6. Final Summary

This system adds a powerful discount and credit layer on top of the existing financial structure without requiring any core financial changes.
