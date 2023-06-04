import logo from './logo.svg';
import './App.css';
import { encryptText, decryptText } from './lit/lit';
import {blobToBase64} from './utils/base64';
import { useEffect, useState } from "react";
import { mintLitNft, connectWallet, fetchNfts } from "./utils/useContract";
import RingLoader from "react-spinners/RingLoader";

/**
 * App Comoponent
 * @returns 
 */
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [text, setText] = useState(null);
  const [name, setName] = useState("SampleLitNFT");
  const [imageUrl, setImageUrl] = useState("https://dl.openseauserdata.com/cache/originImage/files/04f0f618ecf6133b2ebbeb0e578cd72b.jpg");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [encryptedData, setEncryptedData] = useState("");
  const [symmetricKey, setSymmetricKey] = useState("");
  const [decryptedData, setEdcryptedData] = useState("");


  /**
   * encrypt & mint NFT method
   */
  const mintNft = async () => {
    try {
      setIsLoading(true);
      // encryptText
      const { encryptedString, encryptedSymmetricKey } = await encryptText(text);

      setEdcryptedData(encryptedString);
      setSymmetricKey(encryptedSymmetricKey);

      // concevt blob to base64
      const encryptedDescriptionString = await blobToBase64(encryptedString);
      // mint NFT
      await mintLitNft(
        name,
        imageUrl,
        encryptedDescriptionString,
        encryptedSymmetricKey
      );

      setIsLoading(false);
    } catch(err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };

  /**
   * decrypt
   */
  const decrypt = async() => {
    await decryptText(JSON.stringify(nfts[1].encryptedDescription), JSON.stringify(nfts[1].encryptedSymmetricKey))
      .then((res) => console.log("decyrpt result:", res))
  };

  /**
   * connect method
   */
  const conncet = async() => {
    const address = await connectWallet();
    setCurrentAccount(address);
  };

  useEffect(() => {
    const init = async() => {
      const _nfts = await fetchNfts();
      setNfts(_nfts);
    };
    init();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {!currentAccount ? (
          <p>
            <button
              onClick={conncet}
            >
              Please connect Wallet
            </button>
          </p>
        ) : (
          <>
            {isLoading ? 
              <RingLoader color="#36d7b7" />
            : (
              <>
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => {setText(e.target.value)}}
                  /> 
                  <br/>
                  <button
                    onClick={mintNft}
                  >
                    encrypt
                  </button>
                  Encrypted text:
                  <input 
                    type='text' 
                    value={encryptedData} 
                    onChange={(e) => {setEncryptedData(e.target.value)}}
                  />
                  <br/>
                  Encrypted key
                  <input 
                    type='text' 
                    value={symmetricKey} 
                    onChange={(e) => {setSymmetricKey(e.target.value)}}
                  />
                </div>
                <div>
                  <button
                    onClick={decrypt}
                  >
                    decrypt
                  </button>
                </div>
                <div>
                  minted Nfts's encryptedDescription : {JSON.stringify(nfts[0].encryptedDescription)}
                  minted Nfts's key : {JSON.stringify(nfts[0].encryptedSymmetricKey)}
                </div>
              </>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;