const fcl = require('@onflow/fcl');
const CryptoJS = require('crypto-js');
require('dotenv').config();

fcl.config()
	.put('fcl.limit', 9999)
	.put('flow.network', process.env.FLOW_NETWORK)
	.put('accessNode.api', process.env.ACCESS_NODE_API);

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
}

module.exports = flowService;
