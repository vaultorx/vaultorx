pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title OpuxvaultNFT
 * @dev ERC721 NFT contract for Opuxvault marketplace
 */
contract OpuxvaultNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Royalty info
    uint256 public royaltyBps;
    address public royaltyRecipient;
    
    // Collection metadata
    string public collectionURI;
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _royaltyBps,
        address _royaltyRecipient
    ) ERC721(_name, _symbol) {
        require(_royaltyBps <= 1000, "Royalty too high"); // Max 10%
        royaltyBps = _royaltyBps;
        royaltyRecipient = _royaltyRecipient;
    }
    
    /**
     * @dev Mint new NFT with IPFS metadata URI
     */
    function safeMint(address _to, string memory _tokenURI) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Set collection metadata URI
     */
    function setCollectionURI(string memory _uri) external onlyOwner {
        collectionURI = _uri;
    }
    
    /**
     * @dev Update royalty info
     */
    function setRoyaltyInfo(uint256 _royaltyBps, address _recipient) external onlyOwner {
        require(_royaltyBps <= 1000, "Royalty too high");
        royaltyBps = _royaltyBps;
        royaltyRecipient = _recipient;
    }
    
    // Required overrides
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
