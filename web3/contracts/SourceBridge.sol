// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing ERC721 interfaces from OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title SourceBridge
 * @dev Contract to facilitate bridging of ERC721 tokens from the source chain to a destination chain.
 */
contract SourceBridge is IERC721Receiver {
    // IERC721 interface representing the ERC721 token
    IERC721 public token;

    // Mapping to store processed nonces to prevent duplicate processing
    mapping(bytes32 => bool) public processedNonces;

    // Event emitted when a token is bridged
    event Transfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 date,
        bytes32 nonce
    );

    // Constructor to set the address of the ERC721 token
    constructor(address tokenAddress) payable {
        token = IERC721(tokenAddress);
    }

    /**
     * @dev Required override of the onERC721Received function from IERC721Receiver.
     * Allows the contract to receive ERC721 tokens.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @dev Generates a unique hash-based nonce for each transfer.
     * @param from The address of the sender.
     * @param tokenId The token ID being transferred.
     * @return A bytes32 nonce.
     */
    function generateNonce(address from, uint256 tokenId)
        public
        view
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    from,
                    tokenId,
                    block.timestamp
                )
            );
    }

    /**
     * @dev Initiates the bridging of a token to the destination chain.
     * @param to The address on the destination chain to receive the token.
     * @param tokenId The token ID of the NFT to be bridged.
     */
    function bridgeToken(address to, uint256 tokenId) external {
        bytes32 nonce = generateNonce(msg.sender, tokenId);
        require(!processedNonces[nonce], "transfer already processed");
        processedNonces[nonce] = true;
        token.safeTransferFrom(msg.sender, address(this), tokenId);
        emit Transfer(msg.sender, to, tokenId, block.timestamp, nonce);
    }

    /**
     * @dev Allows withdrawal of a token from the bridge.
     * @param to The address to receive the token.
     * @param tokenId The token ID of the NFT.
     */
    function withdraw(address to, uint256 tokenId) external {
        token.safeTransferFrom(address(this), to, tokenId);
    }
}
