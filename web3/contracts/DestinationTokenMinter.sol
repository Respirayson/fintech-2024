// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing OpenZeppelin's ERC721 standard contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title DestinationTokenMinter
 * @dev ERC721 compliant contract for creating and managing insurance policy NFTs.
 */
contract DestinationTokenMinter is ERC721, ERC721Burnable {
    // Counter for the total supply of tokens
    uint256 totalSupply = 0;

    // Structure representing an insurance policy
    struct Insurance {
        // uint256 policyNumber; // removed due to privacy concerns
        uint256 startDate;
        uint256 maturityDate;
        string name;
        uint256 sumAssured;
        uint256 tokenId; // token id on the source chain
        address owner;
    }

    // Mapping from token ID to insurance policies
    mapping(uint256 => Insurance) public insurances;

    // Mapping from owner address to their insurance policies
    mapping(address => Insurance[]) public insuranceToOwner;

    // Address of the bridge contract
    address bridge;

    // Constructor setting the bridge address and initializing the ERC721 contract
    constructor(address _bridge) payable ERC721("D-WInsurance", "DWIN") {
        bridge = _bridge;
    }

    // Modifier to restrict certain functions to the bridge contract
    modifier onlyBridge() {
        require(msg.sender == bridge, "Only bridge can call this function");
        _;
    }

    // Override of the burn function from ERC721Burnable
    function burn(uint256 tokenId) public override(ERC721Burnable) {
        // Delete the insurance policy upon burning the token
        delete insurances[tokenId];
        super.burn(tokenId);
    }

    // Override of the tokenURI function from ERC721
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
     * @param _startDate The start date of the insurance policy.
     * @param _maturityDate The maturity date of the insurance policy.
     * @param _name The name of the insurance policy.
     * @param _sumAssured The sum assured by the insurance policy.
     * @param _to The owner of the new insurance policy token.
     * @param _tokenId The token ID on the source chain.
     * @return The new token ID on this chain.
     */
    function createNewMirroredPolicy(
        uint256 _startDate,
        uint256 _maturityDate,
        string memory _name,
        uint256 _sumAssured,
        address _to,
        uint256 _tokenId
    ) public onlyBridge() returns (uint256) {
        
        uint256 id = totalSupply;

        // Create a new insurance policy
        Insurance memory newInsurance = Insurance(
            _startDate,
            _maturityDate,
            _name,
            _sumAssured,
            _tokenId,
            _to
        );

        // Increment the total supply
        totalSupply++;

        // Store the new policy
        insurances[id] = newInsurance;
        insuranceToOwner[_to].push(newInsurance);

        // Mint a new token
        _safeMint(_to, id);

        return id;
    }

    /**
     * @dev Burns a mirrored policy token.
     * @param _tokenId The token ID of the policy to burn.
     */
    function burnMirroredPolicy(uint256 _tokenId) public onlyBridge() {
        burn(_tokenId);
    }

    /**
     * @dev Retrieves the source token ID of a mirrored policy.
     * @param _tokenId The token ID on this chain.
     * @return The token ID on the source chain.
     */
    function getSourceTokenID(uint256 _tokenId) public view onlyBridge() returns (uint256) {
        return insurances[_tokenId].tokenId;
    }

    /**
     * @dev Transfers an insurance policy to a new owner.
     * @param _tokenId The token ID of the policy.
     * @param _from The current owner's address.
     * @param _to The new owner's address.
     */
    function transferPolicyToNewOwner(
        uint256 _tokenId,
        address _from,
        address _to
    ) public {
        Insurance memory insurance = insurances[_tokenId];

        // Transfer the policy to the new owner
        for (uint256 i = 0; i < insuranceToOwner[_from].length; i++) {
            if (insuranceToOwner[_from][i].tokenId == insurance.tokenId) {
                delete insuranceToOwner[_from][i];
                break;
            }
        }
        insurance.owner = _to;
        insuranceToOwner[_to].push(insurance);
    }

}
