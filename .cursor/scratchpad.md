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

We have successfully implemented the core frontend components for our decentralized 5G network on Flow blockchain:

1. **Authentication System**:

    - Implemented Magic.link email-based authentication
    - Created auth context for managing user state
    - Added protected routes and authentication flow

2. **UI Components**:

    - Created reusable components (Button, Card, Input, etc.)
    - Implemented layout with navigation and responsive design
    - Built forms for registration and interaction

3. **Pages**:

    - Landing page with hero section and features
    - Login page with Magic.link integration
    - Dashboard for hotspot management and rewards
    - Hotspot registration page
    - Network visualization map

4. **Network Map**:
    - Implemented map visualization using react-leaflet
    - Added hotspot markers with coverage radius
    - Created statistics display for network overview

All frontend components are implementing simulation mode, connecting to mock backend functions that simulate the blockchain interactions. This allows judges to see the full user flow without needing actual 5G hardware.

## Executor's Feedback or Assistance Requests

The frontend implementation is now mostly complete, with all major components in place. However, there are some TypeScript type errors and import path errors that need to be resolved:

1. React type definitions are missing - need to install @types/react
2. Next.js type definitions are missing - need to install appropriate types
3. Some module imports are showing errors

These issues are common when setting up a new TypeScript project and can be resolved by installing the appropriate type definitions.

To complete the project for the Sunday demo:

1. Fix the type definitions by installing the necessary packages
2. Connect the frontend to the Flow testnet for demonstration
3. Set up a deployment pipeline for hosting the app
4. Prepare demonstration scripts for judges

## Project Status Board

### Smart Contracts

-   [IN PROGRESS] NFT contract for hotspot operators (80% complete)
-   [IN PROGRESS] Hotspot registry contract (70% complete)
-   [IN PROGRESS] Uptime proof submission system (70% complete)
-   [IN PROGRESS] Reward token contract (70% complete)
-   [IN PROGRESS] Reward distribution mechanism (70% complete)

### Frontend (Next Steps)

-   [COMPLETED] Next.js project setup
-   [COMPLETED] Magic.link authentication integration
-   [COMPLETED] Hotspot registration interface
-   [COMPLETED] Operator dashboard
-   [COMPLETED] Network visualization
-   [COMPLETED] Simulation controls for demo

### Integration & Deployment

-   [ ] Fix TypeScript type definitions
-   [ ] Contract deployment to testnet
-   [ ] Frontend-contract integration
-   [ ] Hosting setup (Vercel/Netlify)
-   [ ] Final testing and bug fixes
-   [ ] Demo preparation and documentation

## Potential Blind Spots & Mitigation

1. **Time Management**

    - **Risk**: 3 days is extremely tight for full system implementation
    - **Mitigation**: Focus only on visual elements needed for demo; stub out non-critical functions; prepare fallbacks for demo

2. **Flow Network Congestion**

    - **Risk**: Testnet delays or issues during demo
    - **Mitigation**: Create local emulator fallback; pre-record successful flows as backup

3. **Authentication Complexity**

    - **Risk**: Magic.link integration taking too long
    - **Mitigation**: Implement basic FCL wallet support as fallback; use dev modes for demo if needed

4. **Simulation Realism**

    - **Risk**: Simulation may not convince judges of real-world viability
    - **Mitigation**: Create realistic UI touches (signal strength, latency indicators); add small artificial delays in simulation

5. **Contract Interactions**
    - **Risk**: Complex contract interactions causing bugs close to deadline
    - **Mitigation**: Keep contracts extremely simple; focus on demo flow rather than production-ready code

## Critical Success Factors

1. **Focus on Judge Experience**: All development decisions should prioritize creating a compelling, understandable demo for judges.

2. **Simulate Real-World Challenges**: Even in simulation, highlight the real problems being solved (centralization, coverage gaps, incentives).

3. **Visual Impact**: Create a visually compelling network map that illustrates the decentralized nature of the system.

4. **Clear Narrative**: Ensure the demo tells a coherent story from user registration → hotspot setup → rewards earning.

5. **Minimal Technical Debt**: Despite the rush, maintain clean separation between components to allow post-hackathon expansion.

## Lessons

-   Include informative outputs for debugging in the program.
-   Always read files before attempting to edit them.
-   Check for vulnerabilities using npm audit before proceeding with implementation.
-   Request permission before using force commands with git.

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
