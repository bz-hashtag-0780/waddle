# Decentralized 5G Network on Flow Blockchain

## Background and Motivation

Building a decentralized 5G network on Flow blockchain aims to address the current centralization issues with 5G deployment. Traditional telcos deploy expensive infrastructure slowly, creating coverage gaps especially in rural or underserved areas. The short range of 5G (300-400m) makes it ideal for a decentralized node-based architecture where individuals can deploy mini hotspots and get rewarded for providing service.

## Key Constraints & Decisions

1. **Team Experience**: 20+ Flow mainnet contracts deployed - extensive Cadence expertise.
2. **Timeline**: 3 days only (Thursday night to Sunday) for a complete demo.
3. **Hardware**: No physical 5G hardware - simulation only.
4. **Authentication**: Magic.link for custodial email-based wallets.
5. **Token Economics**: New token for rewards + NFT requirement to operate hotspots.
6. **Target Users**: Both 5G consumers and hotspot operators seeking rewards.
7. **Frameworks**: No strict constraints - free to choose optimal tools.

## MVP Definition (3-Day Scope)

For a compelling judges' demo by Sunday, we'll focus on these core features:

### Smart Contracts (Cadence)

1. **NFT for Hotspot Operators**: Simple non-fungible token that gates hotspot registration
2. **Hotspot Registry**: Track registered node metadata (owner, location, status)
3. **Uptime Reporting**: Basic proof submission mechanism (simulated)
4. **Reward Token**: Fungible token with minting capability
5. **Rewards Distribution**: Calculate and distribute rewards based on uptime

### Frontend (Next.js)

1. **Email Wallet Authentication**: Magic.link integration
2. **Hotspot Registration**: Register new hotspot with location selection
3. **Operator Dashboard**: Show hotspot status and earned rewards
4. **Simulation Controls**: Demo tools for judges to trigger uptime proofs
5. **Network Visualization**: Simple map showing active hotspots

### Critical Path & Priorities

Based on dependencies and core functionality:

1. **Day 1 (Friday)**:

    - Smart Contracts: NFT, Hotspot Registry, Reward Token
    - Frontend: Project setup, Magic.link auth, basic UI components

2. **Day 2 (Saturday)**:

    - Smart Contracts: Uptime reporting and rewards distribution
    - Frontend: Registration flow, dashboard views, network visualization

3. **Day 3 (Sunday)**:
    - Integration: Connect frontend to contracts
    - Simulation Mode: Judge-friendly controls
    - Testing & Deployment: Flow testnet deployment
    - Final Polish: UI refinements and demo script preparation

## High-level Task Breakdown

### Phase 1: Smart Contract Development (Cadence)

1. **NFT Contract for Hotspot Operators**

    - Create basic NFT with required Cadence interfaces
    - Add minting function for admin/test accounts
    - Implement ownership checks for hotspot registration

2. **Hotspot Registry Contract**

    - Define data structure for hotspots (ID, owner, location, status)
    - Implement registration function (requiring NFT ownership)
    - Add update and status change functions

3. **Uptime Proof System**

    - Create structure for uptime submissions
    - Implement proof submission function (simulate with timestamps)
    - Add validation mechanism with timewindow checks

4. **Reward Token Contract**

    - Implement basic fungible token with Flow standards
    - Add minting capabilities for reward distribution
    - Create admin functions for treasury management

5. **Reward Distribution**
    - Calculate rewards based on uptime percentage
    - Implement periodic distribution mechanism
    - Add claim function for hotspot operators

### Phase 2: Frontend Development

1. **Project Setup**

    - Initialize Next.js application
    - Set up FCL configuration for Flow
    - Configure Magic.link integration
    - Create basic layout and component library

2. **Authentication System**

    - Implement Magic.link email login
    - Add session management
    - Create user onboarding flow

3. **Hotspot Management**

    - Build hotspot registration form
    - Create location selection with map interface
    - Implement NFT checking and validation

4. **Dashboard Views**

    - Create operator dashboard with hotspot status
    - Build rewards history and statistics
    - Add network health indicators

5. **Simulation & Demo Tools**
    - Develop simulation panel for triggering events
    - Create automatic uptime reporting simulation
    - Add demo reset functionality for judges

## Current Status / Progress Tracking

We've successfully fixed the Magic Link authentication implementation:

1. **Magic Link Integration Update**:

    - Fixed the Flow extension configuration to properly include required rpcUrl and network parameters ✅
    - Updated the user module methods to use `getInfo()` instead of the deprecated `getMetadata()` ✅
    - Properly typed the Magic SDK with Flow extension to avoid TypeScript errors ✅
    - The authentication now works properly with the provided publishable key ✅

2. **Error Resolution**:

    - Fixed `TypeError: Cannot read properties of undefined (reading 'rpcUrl')` error by properly configuring the Flow extension ✅
    - Resolved type issues with the Magic SDK by properly defining custom type with extensions ✅

3. **Development Environment**:
    - Successfully started the development server ✅
    - The login page is now functional and can authenticate users ✅

We've also successfully deployed all smart contracts to the Flow testnet:

1. **Smart Contract Deployment**:

    - Successfully deployed HotspotOperatorNFT to Flow testnet (0x010f2d483a538e7e) ✅
    - Successfully deployed FIVEGCOIN to Flow testnet (0x010f2d483a538e7e) ✅
    - Successfully deployed HotspotRegistry to Flow testnet (0x010f2d483a538e7e) ✅
    - Successfully deployed UptimeProof to Flow testnet (0x010f2d483a538e7e) ✅

2. **Frontend Configuration**:
    - Updated FCL configuration to point to testnet contracts ✅
    - Set up proper contract addresses in flow.ts services ✅
    - Added FCL configuration to app layout ✅

The Magic Link implementation is now fully operational and users can successfully log in using their email. All smart contracts have been deployed to the Flow testnet.

## Executor's Feedback or Assistance Requests

I've successfully fixed the Magic Link authentication by:

1. **Root Cause Analysis**:

    - The Flow extension was missing required configuration parameters (`rpcUrl` and `network`)
    - The Magic SDK user methods changed from `getMetadata()` to `getInfo()`
    - TypeScript types needed to be properly defined for the Magic SDK with extensions

2. **Solution Implementation**:
    - Added proper Flow extension configuration with rpcUrl and network parameters
    - Updated code to use the current Magic SDK API methods
    - Fixed TypeScript typing with proper extension type definitions
    - Tested the authentication flow to ensure it works correctly

The authentication is now fully operational! Users can log in with their email using Magic Link, and the application correctly handles the authentication state.

All smart contracts have been successfully deployed to Flow testnet. The frontend has been configured to interact with these contracts via FCL.

## Project Status Board

### Smart Contracts

-   [COMPLETED] NFT contract for hotspot operators ✅
-   [COMPLETED] Hotspot registry contract ✅
-   [COMPLETED] Uptime proof submission system ✅
-   [COMPLETED] Reward token contract (FIVEGCOIN) ✅
-   [COMPLETED] Deploy all contracts to testnet ✅

### Frontend (Current Progress)

-   [COMPLETED] Next.js project setup ✅
-   [COMPLETED] Component and page structure ✅
-   [COMPLETED] Import path fixes ✅
-   [COMPLETED] Magic Link authentication setup ✅
-   [COMPLETED] FCL configuration for testnet ✅
-   [COMPLETED] Fix Magic Link authentication errors ✅
-   [IN PROGRESS] Implement dashboard functionality
-   [IN PROGRESS] Complete hotspot registration flow
-   [IN PROGRESS] Finalize network visualization

### Integration & Deployment

-   [COMPLETED] Fix TypeScript type definitions ✅
-   [COMPLETED] Contract deployment to testnet ✅
-   [IN PROGRESS] Frontend-contract integration
-   [ ] Hosting setup (Vercel)
-   [ ] Final testing and bug fixes
-   [ ] Demo preparation and documentation

## High Priority Tasks (Next Steps)

1. **Restore Missing Frontend Files**

    - Recreate the deleted React components (Button, Input, Card, Layout, etc.)
    - Restore the type definition files that are missing
    - Recreate the page components for app/login, app/dashboard, app/hotspots/register, etc.
    - Success criteria: All frontend routes are functional

2. **Implement Real Contract Interactions**

    - Update the flow.ts service to use real contract calls instead of simulation mode
    - Create transaction scripts for hotspot registration
    - Implement real uptime proof submission
    - Success criteria: Frontend can mint NFTs, register hotspots, and submit uptime proofs on testnet

3. **Create Demo Mode for Judges**

    - Build a UI component for triggering demo actions
    - Add simulation controls for quick testing
    - Implement visualizations to demonstrate the system working
    - Success criteria: Judges can easily test the complete flow in a predictable way

4. **Deploy Frontend to Vercel**

    - Set up a Vercel project for the frontend
    - Configure environment variables for production
    - Deploy the application
    - Success criteria: Application is accessible online via a public URL

5. **Create Documentation**

    - Write a detailed README with project overview
    - Add instructions for local development
    - Document the smart contract architecture
    - Create a script for the demo presentation
    - Success criteria: Anyone can understand the project and how to run it

## Potential Blind Spots & Mitigation

1. **Missing Frontend Files**

    - **Risk**: Critical frontend files have been deleted
    - **Mitigation**: Recreate essential components and pages with minimal functionality to demonstrate the core features

2. **Testnet Reliability**

    - **Risk**: Flow testnet might experience issues during demo
    - **Mitigation**: Create fallback simulation mode that works without blockchain if needed

3. **Limited Testing Time**

    - **Risk**: Not enough time to thoroughly test all contract interactions
    - **Mitigation**: Focus on testing the critical paths first; prepare backup plans for demo

4. **Magic Link Integration**

    - **Risk**: Magic Link might have issues with Flow on testnet
    - **Mitigation**: Have a direct FCL wallet connection as backup

5. **Transaction Failures**

    - **Risk**: Smart contract transactions might fail in unexpected ways
    - **Mitigation**: Add robust error handling and user-friendly error messages

## Lessons

1. Always test deployed contracts thoroughly before considering deployment complete
2. Keep configuration values in a centralized location to avoid inconsistencies
3. Make regular backups of critical files
4. When using testnet, account for potential delays and unreliability
5. Keep a development version that works offline as a backup for demos

## Risk Assessment and Mitigation Strategies

1. **Technical Risks**

    - **Cadence Contract Complexity**: Start with simplified contracts and add features incrementally.
    - **Scalability Issues**: Design with potential network growth in mind, implement pagination and efficient data structures.
    - **Security Vulnerabilities**: Follow best practices, consider security audits, and implement thorough testing.

2. **Project Risks**

    - **Scope Creep**: Clearly define MVP requirements and stick to them before adding additional features.
    - **Timeline Constraints**: Prioritize core functionality and implement stretch goals only if time permits.
    - **Knowledge Gaps**: Allocate time for learning Flow/Cadence if team is not experienced.

3. **Business/Operational Risks**
    - **Regulatory Issues**: Research 5G deployment regulations in target regions.
    - **Network Reliability**: Implement robust error handling and fallback mechanisms.
    - **User Adoption**: Focus on simplifying UX to lower barriers to entry.

## Clear Next Steps

### 1. Smart Contract Deployment (Priority: Critical)

-   **Description**: Deploy smart contracts to Flow testnet to enable all blockchain functionality
-   **Tasks**:
    -   [ ] Finalize NFT contract for hotspot operators
    -   [ ] Finalize Hotspot registry contract
    -   [ ] Finalize Uptime proof submission system
    -   [ ] Finalize Reward token contract
    -   [ ] Finalize Reward distribution mechanism
    -   [ ] Deploy all contracts to Flow testnet
    -   [ ] Update frontend configuration with deployed contract addresses
    -   [ ] Test contract interactions from frontend
-   **Dependencies**: Cadence contract code (80% complete)
-   **Success Criteria**:
    -   All contracts successfully deployed to testnet
    -   Contract methods can be called from frontend
    -   Transactions execute correctly
    -   Events are emitted as expected

### 2. Dashboard Functionality (Priority: High)

-   **Description**: Complete the dashboard UI and data flow to display hotspot information and rewards
-   **Tasks**:
    -   [ ] Complete data fetching for user's hotspots from deployed contracts
    -   [ ] Implement reward calculation display
    -   [ ] Add visual indicators for hotspot status (online/offline)
    -   [ ] Create summary statistics widgets
    -   [ ] Connect real-time status updates
-   **Dependencies**: Smart contracts deployed (step 1)
-   **Success Criteria**:
    -   Dashboard correctly displays all user's hotspots
    -   Reward calculations are shown accurately
    -   Status changes reflect immediately
    -   Performance maintains <2s load time

### 3. Hotspot Registration Flow (Priority: High)

-   **Description**: Enable users to register new hotspots on the network
-   **Tasks**:
    -   [ ] Complete the registration form components
    -   [ ] Implement map-based location selection
    -   [ ] Add validation for registration inputs
    -   [ ] Connect to Flow contract for registration transactions
    -   [ ] Create success/error handling with user feedback
-   **Dependencies**: Smart contracts deployed (step 1)
-   **Success Criteria**:
    -   Users can register hotspots with precise locations
    -   New hotspots appear on dashboard after registration
    -   Proper validation prevents invalid submissions
    -   Flow contract interactions succeed

### 4. Network Visualization (Priority: Medium)

-   **Description**: Create an interactive map showing all network hotspots
-   **Tasks**:
    -   [ ] Build base map implementation with Leaflet
    -   [ ] Add hotspot markers with status indicators
    -   [ ] Implement zoom and region filtering
    -   [ ] Add coverage visualization overlay
    -   [ ] Create interactive elements for hotspot inspection
-   **Dependencies**: Smart contracts deployed (step 1), Hotspot data retrieval (part of dashboard tasks)
-   **Success Criteria**:
    -   Map loads efficiently with 100+ hotspot markers
    -   Visual distinction between hotspot states
    -   Interactive elements work smoothly
    -   Coverage visualization accurately represents network density

### 5. Deployment & Testing (Priority: Medium)

-   **Description**: Deploy application to Vercel for testing
-   **Tasks**:
    -   [ ] Configure environment variables for production
    -   [ ] Set up build process
    -   [ ] Deploy to Vercel
    -   [ ] Test all features in deployment environment
    -   [ ] Create test accounts and sample data
-   **Dependencies**: Working features to test
-   **Success Criteria**:
    -   Application deploys successfully
    -   All features work identically to development environment
    -   Load times are acceptable (<3s initial load)
    -   No console errors in production
