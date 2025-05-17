// FIVEGCOIN.cdc 5G COIN
//
// This contract implements a fungible token that will be used
// to reward hotspot operators for providing 5G network coverage.

import "FungibleToken"
import "MetadataViews"
import "FungibleTokenMetadataViews"

access(all) contract FIVEGCOIN: FungibleToken {

    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)
    access(all) event TokensMinted(amount: UFix64)

    access(all) var totalSupply: UFix64
    access(all) resource Vault: FungibleToken.Vault {

        access(all) var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        access(contract) fun burnCallback() {
            if self.balance > 0.0 {
                FIVEGCOIN.totalSupply = FIVEGCOIN.totalSupply - self.balance
            }
            self.balance = 0.0
        }

        access(all) view fun getSupportedVaultTypes(): {Type: Bool} {
            return {self.getType(): true}
        }

        access(all) view fun isSupportedVaultType(type: Type): Bool {
            if (type == self.getType()) { return true } else { return false }
        }

        access(all) view fun isAvailableToWithdraw(amount: UFix64): Bool {
            return amount <= self.balance
        }

        access(FungibleToken.Withdraw) fun withdraw(amount: UFix64): @{FungibleToken.Vault} {
            self.balance = self.balance - amount

            if let address = self.owner?.address {
                    emit TokensWithdrawn(amount: amount, from: address)
            } else {
                emit TokensWithdrawn(amount: amount, from: nil)
            }
            return <-create Vault(balance: amount)
        }

        access(all) fun deposit(from: @{FungibleToken.Vault}) {
            let vault <- from as! @FIVEGCOIN.Vault
            self.balance = self.balance + vault.balance

            if let address = self.owner?.address {
                emit TokensDeposited(amount: vault.balance, to: address)
            } else {
                emit TokensDeposited(amount: vault.balance, to: nil)
            }
            vault.balance = 0.0
            destroy vault
        }

        access(all) view fun getViews(): [Type]{
            return []
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            return nil
        }

        access(all) fun createEmptyVault(): @{FungibleToken.Vault} {
            return <-create Vault(balance: 0.0)
        }
    }

    access(all) fun createEmptyVault(vaultType: Type): @FIVEGCOIN.Vault {
        return <-create Vault(balance: 0.0)
    }

    /// Gets a list of the metadata views that this contract supports
    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return []
    }

    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        return nil
    }

    access(account) fun mintTokens(amount: UFix64): @FIVEGCOIN.Vault {
        pre {
            amount > 0.0: "Amount minted must be greater than zero"
        }
        FIVEGCOIN.totalSupply = FIVEGCOIN.totalSupply + amount

        emit TokensMinted(amount: amount)
        return <-create Vault(balance: amount)
    }

    init() {
        self.totalSupply = 0.0
    }
}
