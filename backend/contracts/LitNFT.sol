// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * LitNft Contract
 */
contract LitNft is ERC721URIStorage, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; // for NFT ids

    struct nft {
        string name;
        string imageUrl;
        string encryptedDescription;
        string encryptedSymmetricKey;
    }

    mapping(uint256 => nft) private tokenIdToNft;

    constructor() ERC721 ("Lit NFT", "LITNFT"){}

    /**
     * getTokenURI method
     */
    function getTokenURI(
        string memory name,
        string memory imageUrl,
        string memory encryptedDescription,
        string memory encryptedSymmetricKey
    ) private pure returns (string memory) {
        bytes memory dataURI = abi.encodePacked( // we're encoding a JSON
            '{',
                '"name": "', name, '",',
                '"image": "', imageUrl, '",',
                '"description": "', encryptedDescription, '",',
                '"symmetricKey": "', encryptedSymmetricKey, '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /**
     * mintLitNft method
     */
    function mintLitNft(
        string memory name,
        string memory imageUrl,
        string memory encryptedDescription,
        string memory encryptedSymmetricKey
    ) public nonReentrant {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _safeMint(msg.sender, newNftTokenId); // from ERC721URIStorage
        _setTokenURI(newNftTokenId, getTokenURI(name, imageUrl, encryptedDescription, encryptedSymmetricKey));
        tokenIdToNft[newNftTokenId] = nft(name, imageUrl, encryptedDescription, encryptedSymmetricKey); // using our struct defined above
    }

    /**
     * fetchNFTs method
     */
    function fetchNfts() public view returns (nft[] memory) {
        nft[] memory nfts = new nft[](_tokenIds.current());
        for (uint256 idx = 1; idx < _tokenIds.current() + 1; idx++) {
            nft memory currNft = tokenIdToNft[idx];
            nfts[idx - 1] = currNft;
        }

        return nfts;
    }
}