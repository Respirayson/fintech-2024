// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importing ERC721 and its extensions from OpenZeppelin
import "@openzeppelin/contracts@5.0.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title SourceTokenMinter
 * @dev ERC721 compliant contract for creating and managing insurance policy tokens.
 */
contract SourceTokenMinter is ERC721, ERC721Burnable {
    // Counter for the total supply of tokens
    uint256 totalSupply = 0;

    // Structure representing an insurance policy
    struct Insurance {
        uint256 policyNumber;
        uint256 startDate;
        uint256 maturityDate;
        string name;
        uint256 sumAssured;
        // additional fields etc.
    }

    // Mapping from token ID to insurance policies
    mapping(uint256 => Insurance) public insurances; // id => insurance

    // Mapping from owner address to their insurance policies
    mapping(address => Insurance[]) public insuranceToOwner; // owner => insurance

    // Constructor to initialize the ERC721 contract
    constructor() ERC721("WInsurance", "WIN") {}

    /**
     * @dev Override of the tokenURI function from ERC721.
     * Returns the URI for a given token ID.
     * @param tokenId The token ID.
     * @return The URI for the token.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Override of the supportsInterface function from ERC721
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Creates a new insurance policy token.
     * @param _policyNumber The policy number.
     * @param _startDate The start date of the policy.
     * @param _maturityDate The maturity date of the policy.
     * @param _name The name of the policy.
     * @param _sumAssured The sum assured by the policy.
     * @return The new token ID.
     */
    function createNewPolicy(
        uint256 _policyNumber,
        uint256 _startDate,
        uint256 _maturityDate,
        string memory _name,
        uint256 _sumAssured
    ) public returns (uint256) {
        // Create a new insurance policy
        Insurance memory newInsurance = Insurance(
            _policyNumber,
            _startDate,
            _maturityDate,
            _name,
            _sumAssured
        );
        uint256 id = totalSupply;
        totalSupply++;

        // Store the new policy
        insurances[id] = newInsurance;
        insuranceToOwner[msg.sender].push(newInsurance);

        // Mint a new token
        _safeMint(msg.sender, id);

        return id;
    }
}
