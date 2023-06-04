/**
 * getEthereum function
 * @returns 
 */
export const getEthereum = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const { ethereum } = window;
    return ethereum;
  }
  return null;
};
