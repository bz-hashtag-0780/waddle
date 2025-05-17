// mintNFTcommit.cdc
//
// This transaction commits to minting a new HotspotOperatorNFT
// using the RandomPicker to ensure fair and verifiable randomness.
// 
// Note: You must run the setupHotspotOperatorNFTCollection transaction first
// to set up your account to receive NFTs.

import "HotspotOperatorNFT"
import "RandomPicker"

transaction {
    prepare(acct: auth(Storage) &Account) {
        // Check if receipt already exists and remove it to avoid conflicts
        if acct.storage.borrow<&RandomPicker.Receipt>(from: RandomPicker.ReceiptStoragePath) != nil {
            // In Cadence 1.0, we need to load and destroy the existing receipt
            let oldReceipt <- acct.storage.load<@RandomPicker.Receipt>(from: RandomPicker.ReceiptStoragePath)
            destroy oldReceipt
        }
        
        // Create a new RandomPicker Receipt for committing to a random NFT
        let receipt: @RandomPicker.Receipt <- HotspotOperatorNFT.mintNFTCommit()
        
        // Save the receipt to storage for later use in the reveal transaction
        acct.storage.save(<-receipt, to: RandomPicker.ReceiptStoragePath)
        
    }
}
