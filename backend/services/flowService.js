const fcl = require('@onflow/fcl');
const CryptoJS = require('crypto-js');
require('dotenv').config();

fcl.config()
	.put('fcl.limit', 9999)
	.put('flow.network', process.env.FLOW_NETWORK)
	.put('accessNode.api', process.env.ACCESS_NODE_API)
	.put('0xHotspotOperatorNFT', '0xcc6a3536f37381a2')
	.put('0xHotspotRegistry', '0xcc6a3536f37381a2')
	.put('0xUptimeProof', '0xcc6a3536f37381a2')
	.put('0xFIVEGCOIN', '0xcc6a3536f37381a2')
	.put('0xHybridCustody', '0x294e44e1ec6993c6')
	.put('0xMetadataViews', '0x631e88ae7f1d7c20')
	.put('0xViewResolver', '0x631e88ae7f1d7c20')
	.put('0xCapabilityFactory', '0x294e44e1ec6993c6')
	.put('0xCapabilityFilter', '0x294e44e1ec6993c6')
	.put('0xCapabilityDelegator', '0x294e44e1ec6993c6')
	.put('0xNonFungibleToken', '0x631e88ae7f1d7c20')
	.put('0xNFTCollectionPublicFactory', '0x294e44e1ec6993c6')
	.put('0xNFTProviderAndCollectionFactory', '0x294e44e1ec6993c6')
	.put('0xNFTProviderFactory', '0x294e44e1ec6993c6');

class flowService {
	static encryptPrivateKey(key) {
		const secret = process.env.SECRET_PASSPHRASE;
		const encrypted = CryptoJS.AES.encrypt(key, secret).toString();
		return encrypted;
	}

	static decryptPrivateKey(encrypted) {
		const secret = process.env.SECRET_PASSPHRASE;
		const decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(
			CryptoJS.enc.Utf8
		);
		return decrypted;
	}

	static async getAdminAccountWithKeyIndex(keyIndex) {
		const FlowSigner = (await import('../utils/signer.mjs')).default;
		const key = this.decryptPrivateKey(
			process.env.ADMIN_ENCRYPTED_PRIVATE_KEY
		);

		const signer = new FlowSigner(
			process.env.ADMIN_ADDRESS,
			key,
			keyIndex,
			{}
		);
		return signer;
	}

	static AdminKeys = (() => {
		let keys = {};
		for (let i = 0; i < 500; i++) {
			keys[i] = false;
		}
		return keys;
	})();

	static async addKeys(numOfKeys) {
		let transaction = `
		transaction(publicKeyHex: String, numOfKeys: Int) {
			prepare(signer: auth(Keys, AddKey) &Account) {
				let publicKey = publicKeyHex.decodeHex()

				let key = PublicKey(
					publicKey: publicKey,
					signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
				)

				var i = 0
				while i < numOfKeys {
					signer.keys.add(
						publicKey: key,
						hashAlgorithm: HashAlgorithm.SHA3_256,
						weight: 1000.0
					)
					i = i + 1
				}
			}
		}
	    `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(process.env.ADMIN_PUBLIC_KEY, t.String),
				arg(numOfKeys, t.Int),
			]);

			if (txid) {
				await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async getAllHotspots() {
		let script = `
import HotspotRegistry from 0xHotspotRegistry      

access(all) fun main(): [HotspotRegistry.Hotspot] {
	return HotspotRegistry.getAllHotspots()
}
        `;

		const allHotspots = await fcl.query({
			cadence: script,
		});

		return allHotspots;
	}

	static async updateHotspotLocation(nftID, lat, lng) {
		let transaction = `

import HotspotRegistry from 0xHotspotRegistry

transaction(nftID: UInt64, lat: UFix64, lng: UFix64) {
    prepare(acct: auth(Storage) &Account) {

        let adminRef = acct.storage.borrow<&HotspotRegistry.Admin>(from: HotspotRegistry.AdminStoragePath)?? panic("Could not borrow Admin reference")
        
        adminRef.updateHotspotLocation(
            id: nftID,
            lat: lat,
            lng: lng
        )

    }
}

        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(nftID, t.UInt64),
				arg(lat, t.UFix64),
				arg(lng, t.UFix64),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				console.log('Txn Sealed!');
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async updateHotspotStatus(nftID, online) {
		let transaction = `

import HotspotRegistry from 0xHotspotRegistry

transaction(nftID: UInt64, online: Bool) {
    prepare(acct: auth(Storage) &Account) {

        let adminRef = acct.storage.borrow<&HotspotRegistry.Admin>(from: HotspotRegistry.AdminStoragePath)?? panic("Could not borrow Admin reference")
        
        adminRef.updateHotspotStatus(id: nftID, online: online)

    }
}

        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(nftID, t.UInt64),
				arg(online, t.Bool),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				console.log('Txn Sealed!');
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	// Prove admin key rotation cycling works
	static async adminTxnTest() {
		let transaction = `

transaction() {
    prepare(acct: auth(Storage) &Account) {    }
}

        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				console.log('Txn Sealed!');
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	// end of class
}

module.exports = flowService;
