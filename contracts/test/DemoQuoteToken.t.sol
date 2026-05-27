// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Test} from "forge-std/Test.sol";
import {DemoQuoteToken} from "../src/DemoQuoteToken.sol";

contract DemoQuoteTokenTest is Test {
    DemoQuoteToken internal token;
    address internal owner = address(0xA11CE);
    address internal alice = address(0xB0B);
    address internal bob = address(0xCAFE);

    function setUp() public {
        token = new DemoQuoteToken(owner);
    }

    function test_ConstructorSetsMetadataAndOwner() public view {
        assertEq(token.name(), "X Cup Demo USD");
        assertEq(token.symbol(), "xUSD");
        assertEq(token.decimals(), 18);
        assertEq(token.owner(), owner);
    }

    function test_OwnerCanMint() public {
        vm.prank(owner);
        token.mint(alice, 5 ether);

        assertEq(token.balanceOf(alice), 5 ether);
    }

    function test_NonOwnerCannotMint() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        token.mint(alice, 1 ether);
    }

    function test_FaucetMintFirstCallMintsFaucetAmount() public {
        token.faucetMint(alice);

        assertEq(token.balanceOf(alice), token.FAUCET_AMOUNT());
        assertEq(token.lastFaucetAt(alice), block.timestamp);
    }

    function test_FaucetMintRevertsDuringCooldown() public {
        token.faucetMint(alice);

        vm.expectRevert(
            abi.encodeWithSelector(DemoQuoteToken.FaucetCooldown.selector, block.timestamp + token.FAUCET_COOLDOWN())
        );
        token.faucetMint(alice);
    }

    function test_FaucetMintSucceedsAfterCooldown() public {
        token.faucetMint(alice);
        vm.warp(block.timestamp + token.FAUCET_COOLDOWN() + 1);
        token.faucetMint(alice);

        assertEq(token.balanceOf(alice), 2 * token.FAUCET_AMOUNT());
    }
}
