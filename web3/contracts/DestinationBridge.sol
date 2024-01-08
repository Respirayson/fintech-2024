// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DestinationTokenMinter.sol";

/**
 * @title DestinationBridge
 * @dev Contract for bridging tokens from a source chain to a destination chain.
 * Inherits from IERC721Receiver to enable receiving NFTs.
 */
contract DestinationBridge is IERC721Receiver {
    // Address of the DestinationTokenMinter contract.
    address public token;

    // Mapping to track processed nonces to prevent duplicate processing.
    mapping(bytes32 => bool) public processedNonces;

    /**
     * @dev Emitted when a token transfer is initiated.
     * @param from Address initiating the transfer.
     * @param to Address receiving the transferred token.
     * @param tokenId ID of the token being transferred.
     * @param date Timestamp of the transfer.
     * @param nonce Unique identifier for the transfer to prevent replays.
     */
    event Transfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 date,
        bytes32 nonce
    );

    // Emitted when a mirrored token is burned.
    event Burn(uint256 tokenId, address owner);

    // Payable constructor to allow the contract to receive Ether.
    constructor() payable {}

    /**
     * @dev Sets the address of the DestinationTokenMinter contract.
     * @param _address New address of the DestinationTokenMinter contract.
     */
    function setTokenAddress(address _address) public {
        token = _address;
    }

    /**
     * @dev Implementation of the IERC721Receiver interface.
     * Allows the contract to receive NFTs.
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
     * @dev Generates a unique nonce for each token transfer.
     * @param from Address initiating the transfer.
     * @param tokenId Token ID being transferred.
     * @return A unique bytes32 nonce.
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
     * @dev Mirrors a token on the destination chain.
     * @param _startDate Start date of the policy.
     * @param _maturityDate Maturity date of the policy.
     * @param _name Name of the policy.
     * @param _sumAssured Sum assured for the policy.
     * @param _to Recipient address on the destination chain.
     * @param _tokenId Token ID on the source chain.
     * @return The new token ID on the destination chain.
     */
    function mirrorToken(
        uint256 _startDate,
        uint256 _maturityDate,
        string memory _name,
        uint256 _sumAssured,
        address _to,
        uint256 _tokenId
    ) public returns (uint256) {
        bytes32 nonce = generateNonce(msg.sender, _tokenId);
        require(!processedNonces[nonce], "transfer already processed");
        processedNonces[nonce] = true;

        return
            DestinationTokenMinter(address(token)).createNewMirroredPolicy(
                _startDate,
                _maturityDate,
                _name,
                _sumAssured,
                _to,
                _tokenId // token ID on the source chain
            );
    }

    /**
     * @dev Burns the mirrored tokens after they are sent back to the bridge.
     * @param tokenId Token ID on the destination chain.
     */
    function burnToken(uint256 tokenId) external {
        uint256 sourceTokenId = DestinationTokenMinter(address(token))
            .getSourceTokenID(tokenId);
        address owner = DestinationTokenMinter(address(token)).ownerOf(tokenId);
        DestinationTokenMinter(address(token)).burnMirroredPolicy(tokenId);
        emit Burn(sourceTokenId, owner);
    }
}
