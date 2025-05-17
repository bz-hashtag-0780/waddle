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

### Phase 3: NFT Collection Refresh Functionality Enhancement

1. **Auto-Refresh After NFT Reveal**

    - Update the NFT minting flow to refresh the collection after reveal
    - Ensure proper loading state management during the refresh
    - Add visual feedback for successful minting and collection update

2. **Refresh Collection Button Functionality**

    - Implement handler function for the Refresh Collection button
    - Connect button to NFT fetching logic
    - Add loading state management for manual refresh
    - Provide visual feedback during refresh operation

3. **Testing and Refinement**
    - Test auto-refresh functionality after minting
    - Test manual refresh button operation
    - Verify that both mechanisms correctly update the NFT collection
    - Optimize refresh logic to avoid redundant operations

### Phase 4: UI Consistency and Layout Enhancement

1. **Layout Consistency for NFTs Page**

    - Analyze the Dashboard page layout structure
    - Identify shared layout components (header, footer, navigation)
    - Determine how layouts are applied in the Next.js application
    - Apply consistent layout structure to the NFTs page

2. **Responsive Design Verification**

    - Test the updated NFTs page on various screen sizes
    - Verify responsive behavior consistency with other pages
    - Fix any responsive design issues
    - Ensure NFT collection display adapts to different viewports

3. **Functionality Verification in New Layout**

    - Test NFT minting process in the updated layout
    - Verify NFT collection display and interactions
    - Confirm refresh functionality works as expected
    - Ensure all UI interactions function properly

4. **Layout Consistency Issues**

    - Applied the Layout component to the NFTs page ✅
    - Added header and footer components to ensure consistent navigation ✅
    - Updated styling to match the rest of the application ✅
    - Ensured all functionality continues to work with the updated layout ✅

### Phase 5: Account Linking Implementation

1. **Hybrid Custody Contract Integration**

    - Import and configure the HybridCustody contract interfaces
    - Set up CapabilityFactory and CapabilityFilter for secure capability management
    - Create necessary scripts and transactions for capability creation and claiming

2. **Account Linking Page Development**

    - Create an account-linking page and component structure
    - Implement a multi-step UI workflow for the linking process
    - Design clear visual indicators for the parent-child account relationship
    - Include proper progress indicators and feedback

3. **Magic.link Child Account Integration**

    - Integrate with existing Magic.link authentication
    - Configure child account setup for linking readiness
    - Implement appropriate transaction signing through Magic.link SDK

4. **Flow Wallet Integration**

    - Add Flow Wallet connection capabilities
    - Implement wallet selection UI similar to Tibles/Dapper examples
    - Configure transaction signing through Flow Wallet (extension/mobile/web)

5. **Testing and Refinement**
    - Test the complete account linking flow end-to-end
    - Verify capability creation and claiming processes
    - Test with various wallet types (extension, mobile, web)
    - Optimize the UI/UX based on testing results

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

3. **FLOW Balance Implementation**:

    - Fixed the `getFlowBalance` function to handle actual Flow blockchain balances ✅
    - Updated the function to handle both string and number balance values from FCL's API ✅
    - Successfully displaying real FLOW token balances in the dashboard ✅

4. **NFT Minting Transaction Implementation**:

    - Created transaction for NFT minting (commit) process ✅
    - Created transaction for NFT revealing process ✅
    - Successful testing of the NFT minting flow on testnet ✅

5. **NFT Frontend Implementation**:

    - Created NFTMinter component that implements the commit + reveal flow ✅
    - Created NFTCollectionViewer component to display owned NFTs ✅
    - Added a dedicated NFTs page to the application ✅
    - Updated authentication context to properly handle user types ✅
    - Integrated NFT components with the Flow blockchain ✅

6. **NFT Display Fix**:

    - Updated the NFT interface to properly handle different ID formats (string, number, object) ✅
    - Added a helper function to safely display NFT IDs regardless of format ✅
    - Simplified validation logic to be more permissive with NFT data structures ✅
    - Added detailed logging to better understand the NFT data flow ✅
    - Successfully displaying NFTs with various ID formats in the collection viewer ✅

7. **NFT Collection Refresh Enhancement**:

    - Added a refresh method to the NFTCollectionViewer component ✅
    - Exposed this method via a ref to be called from parent components ✅
    - Enhanced the getUserNFTs function with a skipCache parameter ✅
    - Updated the NFTs page to use the refreshCollection method ✅
    - Implemented auto-refresh after successful NFT minting ✅

8. **Layout Consistency Issues**:

    - Applied the Layout component to the NFTs page ✅
    - Added header and footer components to ensure consistent navigation ✅
    - Updated styling to match the rest of the application ✅
    - Ensured all functionality continues to work with the updated layout ✅

9. **Account Linking Feature (Planned)**:

    - Need to implement Hybrid Custody contract integration
    - Need to develop an account linking page with multi-step UI
    - Need to integrate with Magic.link for child account setup
    - Need to integrate with Flow Wallet for parent account connection
    - Need to implement capability creation and claiming process

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

We've completed the NFT minting transaction implementation with both commit and reveal transactions. This two-step process provides better security for the NFT minting.

I've also implemented the frontend interface for NFT minting and collection viewing:

1. **NFT Minting Implementation**:

    - Created the NFTMinter component that handles the entire mint process
    - Implemented automatic transaction sequencing (commit then reveal)
    - Added proper state management for transactions
    - Displayed transaction IDs and success messages

2. **NFT Collection Viewer**:

    - Created a component to display the user's NFT collection
    - Implemented detailed NFT viewing with traits
    - Added loading states and empty collection handling
    - Created modal for detailed NFT information

3. **Auth Integration**:

    - Updated auth types to better handle Flow FCL compatibility
    - Added isInitialized and isAuthenticated flags to the context
    - Ensured proper address format compatibility between Magic and FCL

4. **Navigation**:
    - Added an NFTs page to the main navigation
    - Created a dedicated page for the NFT minting and collection functionality

The NFT functionality is now complete and integrated with the Flow blockchain.

## Project Status Board

### Smart Contracts

-   [COMPLETED] NFT contract for hotspot operators ✅
-   [COMPLETED] Hotspot registry contract ✅
-   [COMPLETED] Uptime proof submission system ✅
-   [COMPLETED] Reward token contract (FIVEGCOIN) ✅
-   [COMPLETED] Deploy all contracts to testnet ✅
-   [COMPLETED] NFT minting transactions (commit & reveal) ✅

### Frontend (Current Progress)

-   [COMPLETED] Next.js project setup ✅
-   [COMPLETED] Component and page structure ✅
-   [COMPLETED] Import path fixes ✅
-   [COMPLETED] Magic Link authentication setup ✅
-   [COMPLETED] FCL configuration for testnet ✅
-   [COMPLETED] Fix Magic Link authentication errors ✅
-   [COMPLETED] Implement dashboard with real FLOW balance display ✅
-   [COMPLETED] Implement NFT minting interface ✅
-   [COMPLETED] Fix NFT collection viewer display issues ✅
-   [COMPLETED] Implement auto-refresh after NFT reveal transaction ✅
-   [COMPLETED] Implement Refresh Collection button functionality ✅
-   [COMPLETED] Fix layout consistency for NFTs page ✅
-   [COMPLETED] Apply shared header and footer to NFTs page ✅
-   [PLANNED] Implement account linking feature
-   [PLANNED] Create multi-step UI flow for account linking
-   [PLANNED] Integrate with Flow Wallet for account linking
-   [IN PROGRESS] Complete hotspot registration flow
-   [IN PROGRESS] Finalize network visualization

### Integration & Deployment

-   [COMPLETED] Fix TypeScript type definitions ✅
-   [COMPLETED] Contract deployment to testnet ✅
-   [COMPLETED] NFT transaction implementation ✅
-   [IN PROGRESS] Frontend-contract integration
-   [ ] Hosting setup (Vercel)
-   [ ] Final testing and bug fixes
-   [ ] Demo preparation and documentation

## High Priority Tasks (Next Steps)

1. **Fix NFT Collection Display Issues**

    - **Description**: The NFT collection viewer has display issues and appears inconsistent with the rest of the frontend
    - **Tasks**:
        - [ ] Fix the commented out image and text sections in NFTCollectionViewer.tsx
        - [ ] Update the getUserNFTs function in flow.ts to return proper NFT metadata
        - [ ] Ensure consistent styling between NFT components and the rest of the app
        - [ ] Test NFT display with various NFT types and metadata
        - [ ] Add fallback UI elements for missing NFT data
    - **Dependencies**: flow.ts service with working mintNFTComplete function
    - **Success Criteria**:
        - NFT collection displays properly with images and correct metadata
        - UI styling is consistent with the rest of the application
        - Empty states and loading states work correctly
        - NFT detail view shows complete information

2. **Fix NFT Data Structure and Integration**

    - **Description**: Ensure the NFT data returned from the blockchain is properly structured and displayed
    - **Tasks**:
        - [ ] Update getUserNFTs function to properly query Flow contracts
        - [ ] Ensure NFT metadata is retrieved in the correct format
        - [ ] Implement proper type definitions for NFT data
        - [ ] Add error handling for malformed NFT data
        - [ ] Create a consistent format for displaying NFT traits
    - **Dependencies**: Deployed NFT contract
    - **Success Criteria**:
        - NFT data from blockchain is correctly parsed and displayed
        - All NFT metadata (including traits) is visible in the UI
        - Types are consistent across the application
        - Error handling gracefully manages missing data

3. **Complete Hotspot Registration Flow**

    - **Tasks remaining from previous list**
    - **Additional focus**:
        - [ ] Ensure consistency with rest of app styling
        - [ ] Verify NFT ownership requirement is enforced

4. **Finalize Network Visualization**

    - **Tasks remaining from previous list**
    - **Additional focus**:
        - [ ] Ensure consistency with rest of app styling
        - [ ] Optimize for performance with large number of hotspots

5. **Fix Layout Consistency for NFTs Page**

    - **Description**: The NFTs page currently lacks the consistent layout elements (header, footer) present on other pages like the dashboard
    - **Tasks**:
        - [ ] Analyze the layout structure of the dashboard page
        - [ ] Identify the shared layout components used across the application
        - [ ] Determine how Next.js layouts are applied in the project
        - [ ] Apply consistent layout structure to the NFTs page
        - [ ] Ensure header and footer components are included
        - [ ] Verify styling consistency with the rest of the application
    - **Dependencies**: Existing layout components in the project
    - **Success Criteria**:
        - NFTs page has the same layout structure as the dashboard page
        - Header and footer elements are present and functioning properly
        - Styling is consistent with the rest of the application
        - Responsive behavior matches other pages
        - All NFT functionality continues to work in the updated layout

6. **Implement Account Linking Feature**

    - **Description**: Enable users to link their Magic.link-created child accounts with their Flow Wallet parent accounts using Flow's Hybrid Custody model
    - **Tasks**:
        - [ ] Set up Hybrid Custody contract integration
        - [ ] Create an account-linking page with multi-step UI
        - [ ] Implement Magic.link child account configuration
        - [ ] Add Flow Wallet connection capabilities
        - [ ] Implement capability creation and claiming transactions
        - [ ] Design clear visual indicators for account relationships
        - [ ] Add proper error handling and user feedback
    - **Dependencies**: Existing Magic.link authentication, Flow SDK
    - **Success Criteria**:
        - Users can complete the full linking flow from Magic.link child account to Flow Wallet parent account
        - UI provides clear guidance and feedback throughout the process
        - Transactions are properly created, signed, and executed
        - Linked status is verified and displayed to the user
        - Performance is acceptable with reasonable transaction times

## Detailed NFT Integration Plan

To fix the NFT collection display issues and ensure consistency across the frontend:

### 1. Update NFTCollectionViewer Component

-   **Fix Display Issues**

    -   Uncomment and fix the image display code
    -   Uncomment and fix the metadata display sections
    -   Ensure proper handling of missing thumbnails or metadata
    -   Add appropriate loading states and error handling
    -   Implement responsive design consistent with other components

-   **Improve NFT Detail View**
    -   Enhance the modal display for better user experience
    -   Add more structured display of NFT traits
    -   Include hotspot-specific data if the NFT represents a hotspot
    -   Add action buttons relevant to NFT functionality (e.g., register hotspot)

### 2. Update Flow Service for NFT Data

-   **Enhance getUserNFTs Function**

    -   Replace mock data with actual blockchain queries
    -   Implement proper error handling for failed queries
    -   Add caching for better performance
    -   Ensure consistent data structure is returned

-   **Improve NFT Metadata Handling**
    -   Create proper TypeScript interfaces for NFT metadata
    -   Handle different NFT standards and formats
    -   Implement fallbacks for missing metadata fields
    -   Add functions to format and standardize metadata from different sources

### 3. Style Consistency Updates

-   **Create Shared Styling Components**

    -   Define reusable UI components for NFT displays
    -   Ensure consistent card, button, and layout styling
    -   Match loading and error states with rest of application
    -   Use consistent color schemes and typography

-   **Responsive Design Improvements**
    -   Optimize NFT grid for different screen sizes
    -   Ensure modal displays properly on mobile devices
    -   Implement proper image sizing and lazy loading
    -   Test across multiple viewport sizes

### 4. Testing and Validation

-   **Test with Different NFT Data**

    -   Create test cases with various NFT metadata structures
    -   Test with missing or malformed metadata
    -   Verify display with different image types and sizes
    -   Test performance with large collections

-   **User Flow Testing**
    -   Test complete flows from minting to viewing NFTs
    -   Verify transitions and state updates work correctly
    -   Test error handling and recovery paths
    -   Validate across different browsers and devices

## Success Criteria for NFT Implementation

1. NFT collection correctly displays all user-owned NFTs with proper images and metadata
2. NFT detail view shows complete information including all traits and properties
3. Styling is consistent with the rest of the application's design language
4. Performance remains good even with larger NFT collections
5. Empty states, loading states, and error handling work correctly
6. All NFT-related functionality (minting, viewing) integrates properly with the Flow blockchain

These updates should address the NFT display issues and ensure consistency across the frontend, making the NFT page match the design and functionality of the rest of the application.

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
6. DO NOT modify or create tailwind.config.js as it can break the entire site
7. The project is working with the existing postcss.config.mjs for styling
8. Always check how API responses are structured, as they may return data in different formats than expected (e.g., FLOW balance can be returned as either a string or number).
9. When working with blockchain balances, remember to apply the correct decimal conversion (e.g., FLOW uses 8 decimal places, so divide by 10^8).
10. Use proper type checking and handle different data formats to make functions more robust.
11. Add console logging for debugging to track the actual response formats during development.

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

## Detailed Frontend-Contract Integration Plan

To properly integrate our frontend with the deployed smart contracts on Flow testnet, we need to complete the following specific tasks:

### 1. Update Service Layer (flow.ts)

-   **Replace Simulation Mode with Real Calls**

    -   Convert all mock data returns to actual FCL script executions
    -   Remove hardcoded test data and simulation flags
    -   Implement proper error handling for blockchain interactions

-   **Implement Transaction Functions**

    -   Update `mintHotspotOperatorNFT()` to call the actual contract method
    -   Update `registerHotspot()` to perform real registration with the NFT as collateral
    -   Update `submitUptimeProof()` to send real uptime proof transactions
    -   Add proper transaction result handling and status tracking

-   **Implement Query Functions**
    -   Replace mock data in `getAllHotspots()` with actual blockchain queries
    -   Update `getHotspotUptimeStats()` to fetch real data from `UptimeProof` contract
    -   Implement `checkHotspotOperatorNFTOwnership()` to verify actual NFT ownership
    -   Add new function to get FIVEGCOIN balance for users

### 2. Transaction Script Development

-   **Create and Test Cadence Scripts**

    -   Implement a script to read all registered hotspots
    -   Implement a script to retrieve uptime proofs for a specific hotspot
    -   Implement a script to query user token balances

-   **Create and Test Cadence Transactions**
    -   Create a transaction to mint NFT to user address
    -   Create a transaction to register hotspot with location data
    -   Create a transaction to submit uptime proofs
    -   Create a transaction to claim rewards

### 3. User Authentication Integration

-   **Account Setup for New Users**

    -   Ensure new users can receive an NFT through onboarding
    -   Set up Flow account resources needed for NFT and token storage
    -   Create initialization transaction for first-time users

-   **Account Validation**
    -   Verify user has proper storage paths configured
    -   Check if user needs resource setup before transactions

### 4. Real-time Data Updates

-   **Implement Event Listeners**

    -   Set up FCL event subscription for hotspot registration events
    -   Set up listeners for uptime proof submissions
    -   Set up listeners for reward distribution events

-   **Dashboard Reactivity**
    -   Update dashboard UI when new blockchain events occur
    -   Implement polling for data that doesn't emit events
    -   Add loading states during transaction processing

### 5. Testing and Verification

-   **Contract Method Testing**

    -   Test each contract method from frontend individually
    -   Verify arguments are correctly passed to contract methods
    -   Confirm events are properly emitted and captured

-   **End-to-End Flow Testing**
    -   Test complete user flows (registration → uptime proof → rewards)
    -   Verify state changes are reflected correctly in UI
    -   Test error conditions and recovery paths

### 6. Performance Optimization

-   **Caching Layer**

    -   Implement client-side caching for frequently accessed data
    -   Set up intelligent refetching policies for blockchain data
    -   Optimize query batch sizes for multiple data fetches

-   **Transaction Batching**
    -   Group related transactions when possible
    -   Implement transaction queuing for better UX

### Success Criteria:

-   All simulation mode code is replaced with real blockchain interactions
-   User can mint NFTs, register hotspots, and submit uptime proofs on testnet
-   Dashboard displays real data from blockchain
-   Real-time updates work when blockchain state changes
-   Error handling gracefully manages failed transactions
-   Performance remains responsive even with blockchain latency
