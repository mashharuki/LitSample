import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient();

/**
 * accessControl Conditions
 */
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "100000000000000000", // 0.1 MATIC
    },
  },
];


/**
 * Lit Class
 */
class Lit {
  litNodeClient;

  /**
   * connect method
   */
  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  /**
   * encrypt
   */
  async encryptText(text) {
    if (!this.litNodeClient) {
      // Connect to Lit Network if not already
      await this.connect(); 
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    // encrypt
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);
    // save EncryptionKey
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  };

  /**
   * decrypt
   * @param {*} encryptedString 
   * @param {*} encryptedSymmetricKey 
   */
  async decryptText(encryptedString, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    // get symmetricKey
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig
    });

    return await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    );
  };
}