pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMarketplaceEscrow
 * @dev Secure escrow contract for NFT marketplace transactions
 * Implements atomic swap protocol for trustless NFT-to-stablecoin exchanges
 */
contract NFTMarketplaceEscrow is ReentrancyGuard, Ownable {
    
    // Supported stablecoin for payments (USDC recommended)
    IERC20 public paymentToken;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeBps = 250;
    
    // Escrow struct
    struct Escrow {
        address seller;
        address buyer;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        uint256 royaltyBps;
        address royaltyRecipient;
        uint256 expiresAt;
        EscrowStatus status;
    }
    
    enum EscrowStatus {
        Active,
        Completed,
        Cancelled,
        Disputed
    }
    
    // Mapping from escrow ID to Escrow
    mapping(bytes32 => Escrow) public escrows;
    
    // Events
    event EscrowCreated(
        bytes32 indexed escrowId,
        address indexed seller,
        address indexed buyer,
        address nftContract,
        uint256 tokenId,
        uint256 price
    );
    
    event EscrowCompleted(
        bytes32 indexed escrowId,
        address indexed seller,
        address indexed buyer,
        uint256 sellerAmount,
        uint256 platformFee,
        uint256 royaltyFee
    );
    
    event EscrowCancelled(bytes32 indexed escrowId);
    
    event EscrowDisputed(bytes32 indexed escrowId);
    
    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev Create escrow for NFT purchase
     * Buyer must approve this contract to spend payment tokens before calling
     */
    function createEscrow(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price,
        uint256 _royaltyBps,
        address _royaltyRecipient,
        uint256 _duration
    ) external nonReentrant returns (bytes32) {
        require(_price > 0, "Price must be greater than 0");
        require(_duration > 0 && _duration <= 30 days, "Invalid duration");
        
        // Generate unique escrow ID
        bytes32 escrowId = keccak256(
            abi.encodePacked(
                _nftContract,
                _tokenId,
                msg.sender,
                block.timestamp
            )
        );
        
        require(escrows[escrowId].seller == address(0), "Escrow already exists");
        
        // Get NFT owner (seller)
        address seller = IERC721(_nftContract).ownerOf(_tokenId);
        require(seller != msg.sender, "Cannot buy your own NFT");
        
        // Lock buyer's payment in escrow
        require(
            paymentToken.transferFrom(msg.sender, address(this), _price),
            "Payment transfer failed"
        );
        
        // Create escrow record
        escrows[escrowId] = Escrow({
            seller: seller,
            buyer: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            royaltyBps: _royaltyBps,
            royaltyRecipient: _royaltyRecipient,
            expiresAt: block.timestamp + _duration,
            status: EscrowStatus.Active
        });
        
        emit EscrowCreated(
            escrowId,
            seller,
            msg.sender,
            _nftContract,
            _tokenId,
            _price
        );
        
        return escrowId;
    }
    
    /**
     * @dev Complete escrow - atomic swap of NFT and payment
     * Seller must approve this contract to transfer NFT before calling
     */
    function completeEscrow(bytes32 _escrowId) external nonReentrant {
        Escrow storage escrow = escrows[_escrowId];
        
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(msg.sender == escrow.seller, "Only seller can complete");
        require(block.timestamp <= escrow.expiresAt, "Escrow expired");
        
        // Verify seller still owns the NFT
        require(
            IERC721(escrow.nftContract).ownerOf(escrow.tokenId) == escrow.seller,
            "Seller no longer owns NFT"
        );
        
        // Calculate fees
        uint256 platformFee = (escrow.price * platformFeeBps) / 10000;
        uint256 royaltyFee = (escrow.price * escrow.royaltyBps) / 10000;
        uint256 sellerAmount = escrow.price - platformFee - royaltyFee;
        
        // Transfer NFT to buyer
        IERC721(escrow.nftContract).safeTransferFrom(
            escrow.seller,
            escrow.buyer,
            escrow.tokenId
        );
        
        // Distribute payments
        require(paymentToken.transfer(escrow.seller, sellerAmount), "Seller payment failed");
        require(paymentToken.transfer(owner(), platformFee), "Platform fee failed");
        
        if (royaltyFee > 0 && escrow.royaltyRecipient != address(0)) {
            require(
                paymentToken.transfer(escrow.royaltyRecipient, royaltyFee),
                "Royalty payment failed"
            );
        }
        
        // Update escrow status
        escrow.status = EscrowStatus.Completed;
        
        emit EscrowCompleted(
            _escrowId,
            escrow.seller,
            escrow.buyer,
            sellerAmount,
            platformFee,
            royaltyFee
        );
    }
    
    /**
     * @dev Cancel escrow and refund buyer
     * Can be called by buyer if expired, or by seller before expiration
     */
    function cancelEscrow(bytes32 _escrowId) external nonReentrant {
        Escrow storage escrow = escrows[_escrowId];
        
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Not authorized"
        );
        
        if (msg.sender == escrow.buyer) {
            require(block.timestamp > escrow.expiresAt, "Escrow not expired");
        }
        
        // Refund buyer
        require(
            paymentToken.transfer(escrow.buyer, escrow.price),
            "Refund failed"
        );
        
        // Update escrow status
        escrow.status = EscrowStatus.Cancelled;
        
        emit EscrowCancelled(_escrowId);
    }
    
    /**
     * @dev Dispute escrow (for future dispute resolution mechanism)
     */
    function disputeEscrow(bytes32 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Not authorized"
        );
        
        escrow.status = EscrowStatus.Disputed;
        
        emit EscrowDisputed(_escrowId);
    }
    
    /**
     * @dev Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 1000, "Fee too high"); // Max 10%
        platformFeeBps = _feeBps;
    }
    
    /**
     * @dev Get escrow details
     */
    function getEscrow(bytes32 _escrowId) external view returns (Escrow memory) {
        return escrows[_escrowId];
    }
}
