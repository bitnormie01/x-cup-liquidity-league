// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {TeamPassport} from "../src/TeamPassport.sol";

contract TeamPassportTest is Test {
    TeamPassport internal passport;
    address internal owner = address(0xA11CE);
    address internal alice = address(0xB0B);
    address internal bob = address(0xCAFE);
    bytes32 internal constant BRA = "BRA";
    bytes32 internal constant ARG = "ARG";

    event PassportMinted(address indexed fan, uint256 indexed tokenId, bytes32 indexed teamId);

    function setUp() public {
        passport = new TeamPassport(owner);
    }

    function test_MintHappyPathSetsAllState() public {
        vm.prank(alice);
        uint256 id = passport.mintPassport(BRA);

        assertEq(id, 0);
        assertEq(passport.ownerOf(0), alice);
        assertEq(passport.tokenIdOf(alice), 0);
        assertEq(passport.teamFanCount(BRA), 1);
        assertTrue(passport.hasPassport(alice));
        assertEq(passport.teamOf(alice), BRA);
        assertTrue(passport.isSupporter(alice, BRA));
        assertFalse(passport.isSupporter(alice, ARG));
        assertEq(passport.nextTokenId(), 1);
        (bytes32 teamId, uint64 mintedAt, bool exists) = passport.passportOf(alice);
        assertTrue(exists);
        assertEq(teamId, BRA);
        assertEq(mintedAt, uint64(block.timestamp));
    }

    function test_MintEmitsPassportMintedEvent() public {
        vm.expectEmit(true, true, true, true);
        emit PassportMinted(alice, 0, BRA);

        vm.prank(alice);
        passport.mintPassport(BRA);
    }

    function test_MintRevertsOnZeroTeamId() public {
        vm.prank(alice);
        vm.expectRevert(TeamPassport.InvalidTeam.selector);
        passport.mintPassport(bytes32(0));
    }

    function test_DoubleMintByOneFanReverts() public {
        vm.prank(alice);
        passport.mintPassport(BRA);

        vm.prank(alice);
        vm.expectRevert(TeamPassport.AlreadyMinted.selector);
        passport.mintPassport(ARG);
    }

    function test_TransferFromReverts() public {
        vm.prank(alice);
        passport.mintPassport(BRA);

        vm.prank(alice);
        vm.expectRevert(TeamPassport.Soulbound.selector);
        passport.transferFrom(alice, bob, 0);
    }

    function test_SafeTransferFromNoDataReverts() public {
        vm.prank(alice);
        passport.mintPassport(BRA);

        vm.prank(alice);
        vm.expectRevert(TeamPassport.Soulbound.selector);
        passport.safeTransferFrom(alice, bob, 0);
    }

    function test_SafeTransferFromWithDataReverts() public {
        vm.prank(alice);
        passport.mintPassport(BRA);

        vm.prank(alice);
        vm.expectRevert(TeamPassport.Soulbound.selector);
        passport.safeTransferFrom(alice, bob, 0, "");
    }

    function test_DifferentFansMintDistinctTokenIds() public {
        vm.prank(alice);
        uint256 aliceId = passport.mintPassport(BRA);
        vm.prank(bob);
        uint256 bobId = passport.mintPassport(ARG);

        assertEq(aliceId, 0);
        assertEq(bobId, 1);
        assertEq(passport.teamFanCount(BRA), 1);
        assertEq(passport.teamFanCount(ARG), 1);
        assertEq(passport.nextTokenId(), 2);
    }

    function test_UnknownFanReturnsDefaults() public view {
        assertEq(passport.teamOf(alice), bytes32(0));
        assertFalse(passport.hasPassport(alice));
        assertFalse(passport.isSupporter(alice, BRA));
    }
}
