# Licensing

The single source of truth for who may use what: which Companies bought which Licences, on which Tariff Plans, and which people hold which Roles.

## Language

**Company**:
The paying customer. It buys Licences and employs the people who use the product.
_Avoid_: Tenant, Account, Organization

**Company Admin**:
The person who manages a Company: buys Licences and chooses who sits in them.
_Avoid_: Tenant, Owner

**Manager**:
A person who can do everything an Operator can, plus supervise Operators (for example, review their performance).
_Avoid_: Supervisor

**Operator**:
A person who handles calls and uses the features their Licence's Tariff Plan allows.
_Avoid_: Agent, Employee

**Role**:
The kind of person someone is within a Company (Company Admin, Manager, Operator). The set of Roles is expected to grow.
_Avoid_: Type, Level

**Tariff Plan**:
A named commercial offering that decides which features a Licence grants.
_Avoid_: Plan (alone), Package, Tier

**Licence**:
A Company's purchase of one Tariff Plan for a number of seats.
_Avoid_: Subscription (that is Stripe's billing record), Plan

**Seat**:
One slot in a Licence, occupied by one Operator or Manager. A person occupies at most one Seat at a time. A Company Admin occupies none.
_Avoid_: Slot, Place

**User**:
A person's login identity. A User belongs to one Company and holds a Role in it. Nobody logs in as a Company.
_Avoid_: Account, Member, Profile

**Feature**:
A named capability that a Tariff Plan can include (for example transcription).
_Avoid_: Entitlement, Module

**Permission**:
An action that a Role allows. A person can use a Feature only if their Role has the Permission and their Licence's Tariff Plan includes the Feature.
_Avoid_: Right, Privilege

**Invitation**:
A Company Admin's offer to a person to join the Company in a chosen Role. For an Operator or Manager it holds a free Seat until accepted, declined or expired.
_Avoid_: Invite link, Request

**Grace Period**:
The 3 days after a Licence's payment fails or it is cancelled, during which its people keep access. After it ends, access is denied but data is kept.
_Avoid_: Trial, Buffer

**Access Decision**:
The answer to "may this User use this Feature now?": allow or deny, with a reason when denied.
_Avoid_: Authorization result, Check result

**Usage Allowance**:
The amount of a Feature a Licence may use per month (initially transcription minutes). Part of the Tariff Plan.
_Avoid_: Quota, Limit

**Service Client**:
A program (for example call-center or transcribing) registered to call the Licensing API. Never a person.
_Avoid_: Client (alone), App, Integration
