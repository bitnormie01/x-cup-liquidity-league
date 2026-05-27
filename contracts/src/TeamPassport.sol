// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TeamPassport is ERC721, Ownable {
    struct PassportData {
        bytes32 teamId;
        uint64 mintedAt;
        bool exists;
    }

    mapping(address => PassportData) public passportOf;
    mapping(bytes32 => uint256) public teamFanCount;
    mapping(address => uint256) public tokenIdOf;
    uint256 public nextTokenId;

    error Soulbound();
    error AlreadyMinted();
    error InvalidTeam();

    event PassportMinted(address indexed fan, uint256 indexed tokenId, bytes32 indexed teamId);

    /// @notice Creates the soulbound team passport collection with the provided owner.
    constructor(address owner_) ERC721("X Cup Team Passport", "XCUP-PASS") Ownable(owner_) {}

    /// @notice Mints one passport for the caller and permanently records their selected team.
    function mintPassport(bytes32 teamId) external returns (uint256 tokenId) {
        if (teamId == bytes32(0)) {
            revert InvalidTeam();
        }
        if (passportOf[msg.sender].exists) {
            revert AlreadyMinted();
        }

        tokenId = nextTokenId;
        unchecked {
            nextTokenId = tokenId + 1;
        }

        passportOf[msg.sender] = PassportData({teamId: teamId, mintedAt: uint64(block.timestamp), exists: true});
        tokenIdOf[msg.sender] = tokenId;
        teamFanCount[teamId] += 1;

        _safeMint(msg.sender, tokenId);
        emit PassportMinted(msg.sender, tokenId, teamId);
    }

    /// @notice Returns the team selected by a fan, or bytes32(0) if they have no passport.
    function teamOf(address fan) external view returns (bytes32) {
        return passportOf[fan].teamId;
    }

    /// @notice Returns whether a fan has minted a team passport.
    function hasPassport(address fan) external view returns (bool) {
        return passportOf[fan].exists;
    }

    /// @notice Returns whether a fan has a passport for the given team.
    function isSupporter(address fan, bytes32 teamId) external view returns (bool) {
        return passportOf[fan].exists && passportOf[fan].teamId == teamId;
    }

    /// @notice Blocks transfers while allowing mints and burns.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert Soulbound();
        }
        return super._update(to, tokenId, auth);
    }
}
