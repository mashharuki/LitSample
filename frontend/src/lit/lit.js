import * as LitJsSdk from "@lit-protocol/lit-node-client";


/**
 * accessControl Conditions
 */
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "mumbai",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "100000000000000000", // 0.1 MATIC
    },
  },
];

/**
 * encrypt
 */
export async function encryptText(text) {
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();

  const chain = "mumbai"

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
  // encrypt
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);
  // save EncryptionKey
  const encryptedSymmetricKey = await client.saveEncryptionKey({
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
export async function decryptText(encryptedString, encryptedSymmetricKey) {
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();

  const chain = "mumbai"

  const encryptedDescriptionBlob = await (await fetch(encryptedString)).blob();

  console.log("encryptedDescriptionBlob:", encryptedDescriptionBlob)

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
  // get symmetricKey
  const symmetricKey = await client.getEncryptionKey({
    accessControlConditions: accessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain,
    authSig
  });

  return await LitJsSdk.decryptString(
    encryptedDescriptionBlob,
    symmetricKey
  );
};
