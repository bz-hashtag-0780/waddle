import * as fcl from '@onflow/fcl';
import { Magic as MagicBase } from 'magic-sdk';
import { FlowExtension } from '@magic-ext/flow';

// Define Magic type correctly
export type Magic = MagicBase<[FlowExtension]>;

// Contract addresses are configured in fcl-config.ts
// These are imported automatically when transactions reference them like 0xHybridCustody

/**
 * Sets up a child account (Magic.link account) with an OwnedAccount resource
 */
export const setupChildAccount = async (magic: Magic): Promise<string> => {
	try {
		console.log('Setting up child account...');

		const transactionId = await fcl.mutate({
			cadence: `
        import HybridCustody from 0x294e44e1ec6993c6
        import MetadataViews from 0x1d7e57aa55817448
        
        transaction {
          prepare(acct: AuthAccount) {
            // Check if ChildAccount already exists
            if acct.borrow<&HybridCustody.ChildAccount>(from: HybridCustody.ChildAccountStoragePath) != nil {
              log("ChildAccount already set up")
              return
            }
            
            // Create a ChildAccount resource
            let childAccount <- HybridCustody.createChildAccount()
            
            // Save it to storage
            acct.save(<-childAccount, to: HybridCustody.ChildAccountStoragePath)
            
            // Create public capability
            let cap = acct.capabilities.storage.issue<&HybridCustody.ChildAccount{HybridCustody.ChildAccountPublic}>(HybridCustody.ChildAccountStoragePath)
            acct.capabilities.publish(cap, at: HybridCustody.ChildAccountPublicPath)
            
            log("ChildAccount setup complete")
          }
        }
      `,
			proposer: magic.flow.authorization,
			authorizations: [magic.flow.authorization],
			payer: magic.flow.authorization,
			limit: 999,
		});

		console.log(
			'Child account setup transaction submitted:',
			transactionId
		);
		return transactionId;
	} catch (error) {
		console.error('Error setting up child account:', error);
		throw error;
	}
};

/**
 * Publishes a child account (Magic.link) to a parent account (Flow wallet)
 * creating the capability that allows the parent to access the child
 */
export const publishToParent = async (
	magic: Magic,
	parentAddress: string
): Promise<string> => {
	try {
		console.log('Publishing capability to parent wallet:', parentAddress);

		const transactionId = await fcl.mutate({
			cadence: `
        import HybridCustody from 0x294e44e1ec6993c6
        
        transaction(parentAddress: Address) {
          prepare(acct: AuthAccount) {
            // Borrow child account
            let childAccount = acct.borrow<&HybridCustody.ChildAccount>(from: HybridCustody.ChildAccountStoragePath)
              ?? panic("Could not borrow ChildAccount")
            
            // Add parent account to list of authorized parents
            childAccount.publishToParent(parentAddress: parentAddress)
            
            log("Capability published to parent")
          }
        }
      `,
			args: (arg, t) => [arg(parentAddress, t.Address)],
			proposer: magic.flow.authorization,
			authorizations: [magic.flow.authorization],
			payer: magic.flow.authorization,
			limit: 999,
		});

		console.log('Publish to parent transaction submitted:', transactionId);
		return transactionId;
	} catch (error) {
		console.error('Error publishing to parent:', error);
		throw error;
	}
};

/**
 * Sets up a parent account (Flow wallet) with a Manager resource
 * This is executed by the Flow wallet, not Magic.link
 */
export const setupParentAccount = async (): Promise<string> => {
	try {
		console.log('Setting up parent account...');

		const transactionId = await fcl.mutate({
			cadence: `
        import HybridCustody from 0x294e44e1ec6993c6
        
        transaction {
          prepare(acct: AuthAccount) {
            // Check if parent account already exists
            if acct.borrow<&HybridCustody.ParentAccount>(from: HybridCustody.ParentAccountStoragePath) != nil {
              log("ParentAccount already set up")
              return
            }
            
            // Create new parent account
            let parentAccount <- HybridCustody.createParentAccount()
            
            // Save it to storage
            acct.save(<-parentAccount, to: HybridCustody.ParentAccountStoragePath)
            
            log("ParentAccount setup complete")
          }
        }
      `,
			proposer: fcl.authz,
			authorizations: [fcl.authz],
			payer: fcl.authz,
			limit: 999,
		});

		console.log(
			'Parent account setup transaction submitted:',
			transactionId
		);
		return transactionId;
	} catch (error) {
		console.error('Error setting up parent account:', error);
		throw error;
	}
};

/**
 * Claims a capability from a child account's inbox
 * This is executed by the Flow wallet, not Magic.link
 */
export const claimCapability = async (
	childAddress: string
): Promise<string> => {
	try {
		console.log('Claiming capability from child account:', childAddress);

		const transactionId = await fcl.mutate({
			cadence: `
        import HybridCustody from 0x294e44e1ec6993c6
        
        transaction(childAddress: Address) {
          prepare(acct: AuthAccount) {
            // Borrow parent account
            let parentAccount = acct.borrow<&HybridCustody.ParentAccount>(from: HybridCustody.ParentAccountStoragePath)
              ?? panic("Could not borrow ParentAccount")
            
            // Claim child account capability
            parentAccount.claimChildAccount(childAddress: childAddress)
            
            log("Capability claimed successfully")
          }
        }
      `,
			args: (arg, t) => [arg(childAddress, t.Address)],
			proposer: fcl.authz,
			authorizations: [fcl.authz],
			payer: fcl.authz,
			limit: 999,
		});

		console.log('Claim capability transaction submitted:', transactionId);
		return transactionId;
	} catch (error) {
		console.error('Error claiming capability:', error);
		throw error;
	}
};

/**
 * Complete account linking process
 * This performs the full sequence of transactions needed to link accounts
 */
export const completeAccountLinking = async (
	magic: Magic,
	parentAddress: string
): Promise<{
	setupTxId: string;
	publishTxId: string;
}> => {
	try {
		// Step 1: Setup child account
		const setupTxId = await setupChildAccount(magic);

		// Step 2: Wait for setup transaction to be sealed
		console.log('Waiting for setup transaction to be sealed...');
		const setupResult = await fcl.tx(setupTxId).onceSealed();
		console.log('Setup transaction sealed:', setupResult);

		// Step 3: Publish to parent
		const publishTxId = await publishToParent(magic, parentAddress);

		return {
			setupTxId,
			publishTxId,
		};
	} catch (error) {
		console.error('Error in complete account linking process:', error);
		throw error;
	}
};
