// RewardToken.cdc
//
// This contract implements a fungible token that will be used
// to reward hotspot operators for providing 5G network coverage.

access(all) contract RewardToken {

    // Events
    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)
    access(all) event TokensMinted(amount: UFix64, to: Address?)
    access(all) event TokensBurned(amount: UFix64, from: Address?)
    access(all) event MinterCreated(minterAddress: Address?)
    access(all) event BurnerCreated(burnerAddress: Address?)
    access(all) event ContractInitialized()

    // Total supply of tokens in existence
    access(all) var totalSupply: UFix64

    // Vault resource that holds the tokens
    access(all) resource Vault {
        // The token balance
        access(all) var balance: UFix64

        // Initialize the balance at resource creation time
        init(balance: UFix64) {
            self.balance = balance
        }

        // Withdraw tokens from the vault
        access(all) fun withdraw(amount: UFix64): @Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        // Deposit tokens into the vault
        access(all) fun deposit(from: @Vault) {
            let amount = from.balance
            self.balance = self.balance + amount
            emit TokensDeposited(amount: amount, to: self.owner?.address)
            destroy from
        }
    }

    // Public interface to the Vault
    access(all) resource interface Provider {
        access(all) fun withdraw(amount: UFix64): @Vault
        access(all) view fun getBalance(): UFix64
    }

    access(all) resource interface Receiver {
        access(all) fun deposit(from: @Vault)
    }

    access(all) resource interface Balance {
        access(all) view fun getBalance(): UFix64
    }

    // Create an empty vault that can store tokens
    access(all) fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    // Resource that allows authorized users to mint new tokens
    access(all) resource Minter {
        // Mint new tokens and deposit into a Vault
        access(all) fun mintTokens(amount: UFix64, recipient: &{Receiver}) {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
            }
            RewardToken.totalSupply = RewardToken.totalSupply + amount
            emit TokensMinted(amount: amount, to: recipient.owner?.address)
            recipient.deposit(from: <-create Vault(balance: amount))
        }
    }

    // Resource that allows authorized users to burn tokens
    access(all) resource Burner {
        // Burn tokens from a Vault
        access(all) fun burnTokens(from: @Vault) {
            let amount = from.balance
            RewardToken.totalSupply = RewardToken.totalSupply - amount
            emit TokensBurned(amount: amount, from: from.owner?.address)
            destroy from
        }
    }

    // Paths for storing resources
    access(all) let VaultStoragePath: StoragePath
    access(all) let VaultReceiverPath: PublicPath
    access(all) let VaultBalancePath: PublicPath
    access(all) let VaultProviderPath: PrivatePath
    access(all) let MinterStoragePath: StoragePath
    access(all) let BurnerStoragePath: StoragePath

    init() {
        self.totalSupply = 0.0

        // Set the named paths
        self.VaultStoragePath = /storage/RewardTokenVault
        self.VaultReceiverPath = /public/RewardTokenReceiver
        self.VaultBalancePath = /public/RewardTokenBalance
        self.VaultProviderPath = /private/RewardTokenProvider
        self.MinterStoragePath = /storage/RewardTokenMinter
        self.BurnerStoragePath = /storage/RewardTokenBurner

        // Create the Minter resource and save it in storage
        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)
        emit MinterCreated(minterAddress: self.account.address)

        // Create the Burner resource and save it in storage
        let burner <- create Burner()
        self.account.storage.save(<-burner, to: self.BurnerStoragePath)
        emit BurnerCreated(burnerAddress: self.account.address)

        // Create an empty Vault for the deployer
        let vault <- self.createEmptyVault()
        self.account.storage.save(<-vault, to: self.VaultStoragePath)

        // Create public capabilities for the vault
        self.account.capabilities.publish(
            at: self.VaultReceiverPath,
            target: self.VaultStoragePath,
            as: Type<&{Receiver}>()
        )
        self.account.capabilities.publish(
            at: self.VaultBalancePath,
            target: self.VaultStoragePath,
            as: Type<&{Balance}>()
        )

        emit ContractInitialized()
    }
} 