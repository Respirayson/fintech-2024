// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DestinationTokenMinter.sol";

/**
 * @title Marketplace Contract
 * @notice A decentralized marketplace for buying and selling Destination Tokens.
 */
contract DestinationChainMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    // Events
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    // Modifiers

    /**
     * @dev Modifier to check if an NFT is not listed for sale.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     */
    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert("AlreadyListed");
        }
        _;
    }

    /**
     * @dev Modifier to check if an NFT is listed for sale.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     */
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert("NotListed");
        }
        _;
    }

    /**
     * @dev Modifier to check if the caller is the owner of an NFT.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     * @param spender Address of the caller.
     */
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert("NotOwner");
        }
        _;
    }

    // Main Functions

    /**
     * @notice Lists an NFT for sale on the marketplace.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     * @param price Sale price for the NFT.
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert("PriceMustBeAboveZero");
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert("NotApprovedForMarketplace");
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /**
     * @notice Cancels a listing for an NFT.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     */
    function cancelListing(
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice Buys a listed NFT.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     */
    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable isListed(nftAddress, tokenId) nonReentrant {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert("PriceNotMet");
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        DestinationTokenMinter instanceToken = DestinationTokenMinter(nftAddress);
        instanceToken.transferPolicyToNewOwner(tokenId, listedItem.seller, msg.sender);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    /**
     * @notice Updates the price of a listed NFT.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     * @param newPrice New price for the NFT.
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (newPrice <= 0) {
            revert("PriceMustBeAboveZero");
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    /**
     * @notice Withdraws proceeds from sales.
     */
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert("NoProceeds");
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    // Getter Functions

    /**
     * @notice Gets the listing details of an NFT.
     * @param nftAddress Address of the NFT contract.
     * @param tokenId Token ID of the NFT.
     * @return Listing details of the NFT.
     */
    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    /**
     * @notice Gets the total proceeds of a seller.
     * @param seller Address of the seller.
     * @return Total proceeds of the seller.
     */
    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
