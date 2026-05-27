// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {Test} from "forge-std/Test.sol";
import {XCupLeagueRegistry} from "../src/XCupLeagueRegistry.sol";

contract XCupLeagueRegistryTest is Test {
    XCupLeagueRegistry internal registry;

    address internal owner = address(0xA11CE);
    address internal controller = address(0xC011);
    address internal unauthorized = address(0xB0B);
    address internal fanToken = address(0xB0A);
    address internal quoteToken = address(0xA0D);

    bytes32 internal constant BRA = "BRA";
    bytes32 internal constant ARG = "ARG";
    bytes32 internal constant FRA = "FRA";
    bytes32 internal constant GER = "GER";

    PoolId internal poolOne = PoolId.wrap(bytes32(uint256(1)));
    PoolId internal poolTwo = PoolId.wrap(bytes32(uint256(2)));

    event TeamRegistered(bytes32 indexed teamId, string name, string symbol, address indexed token, string metadataURI);
    event PoolRegistered(PoolId indexed poolId, bytes32 indexed teamId, Currency fanToken, Currency quoteToken);
    event MatchStateUpdated(
        bytes32 indexed teamId, XCupLeagueRegistry.MatchState state, string reason, uint64 updatedAt
    );
    event ControllerUpdated(address indexed oldController, address indexed newController);

    function setUp() public {
        registry = new XCupLeagueRegistry(owner);
    }

    function test_RegisterTeamEmitsAndStoresTeam() public {
        vm.expectEmit(true, true, false, true);
        emit TeamRegistered(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        (string memory name, string memory symbol, address token, string memory metadataURI, bool exists) =
            registry.teams(BRA);
        assertEq(name, "Brazil");
        assertEq(symbol, "BRA");
        assertEq(token, fanToken);
        assertEq(metadataURI, "ipfs://bra");
        assertTrue(exists);

        (XCupLeagueRegistry.MatchState state, string memory reason, uint64 updatedAt, bool stateExists) =
            registry.matchStateOfTeam(BRA);
        assertEq(uint8(state), uint8(XCupLeagueRegistry.MatchState.PRE_MATCH));
        assertEq(reason, "");
        assertEq(updatedAt, uint64(block.timestamp));
        assertTrue(stateExists);
    }

    function test_RegisterTeamRevertsOnDuplicateTeam() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.TeamAlreadyRegistered.selector, BRA));
        registry.registerTeam(BRA, "Brazil 2", "BR2", address(0xB0B2), "ipfs://bra2");
    }

    function test_RegisterTeamRevertsOnZeroTeamId() public {
        vm.prank(owner);
        vm.expectRevert(XCupLeagueRegistry.InvalidTeamId.selector);
        registry.registerTeam(bytes32(0), "Zero", "ZERO", fanToken, "ipfs://zero");
    }

    function test_RegisterTeamRevertsOnZeroToken() public {
        vm.prank(owner);
        vm.expectRevert(XCupLeagueRegistry.InvalidToken.selector);
        registry.registerTeam(BRA, "Brazil", "BRA", address(0), "ipfs://bra");
    }

    function test_RegisterPoolEmitsAndStoresPoolConfig() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        Currency fan = Currency.wrap(fanToken);
        Currency quote = Currency.wrap(quoteToken);
        vm.expectEmit(true, true, false, true);
        emit PoolRegistered(poolOne, BRA, fan, quote);

        _registerPool(poolOne, BRA, fan, quote);

        (bytes32 teamId, Currency storedFanToken, Currency storedQuoteToken, bool exists) = registry.poolConfig(poolOne);
        assertEq(teamId, BRA);
        assertEq(Currency.unwrap(storedFanToken), fanToken);
        assertEq(Currency.unwrap(storedQuoteToken), quoteToken);
        assertTrue(exists);
    }

    function test_RegisterPoolBeforeTeamExistsReverts() public {
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.TeamNotRegistered.selector, BRA));
        registry.registerPool(poolOne, BRA, Currency.wrap(fanToken), Currency.wrap(quoteToken));
    }

    function test_RegisterPoolWithZeroTeamIdReverts() public {
        vm.prank(owner);
        vm.expectRevert(XCupLeagueRegistry.InvalidTeamId.selector);
        registry.registerPool(poolOne, bytes32(0), Currency.wrap(fanToken), Currency.wrap(quoteToken));
    }

    function test_RegisterPoolDuplicateReverts() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");
        _registerPool(poolOne, BRA, Currency.wrap(fanToken), Currency.wrap(quoteToken));

        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.PoolAlreadyRegistered.selector, poolOne));
        registry.registerPool(poolOne, BRA, Currency.wrap(address(0xB0B2)), Currency.wrap(address(0xA0D2)));
    }

    function test_RegisterPoolWithZeroFanTokenReverts() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        vm.prank(owner);
        vm.expectRevert(XCupLeagueRegistry.InvalidToken.selector);
        registry.registerPool(poolOne, BRA, Currency.wrap(address(0)), Currency.wrap(quoteToken));
    }

    function test_RegisterPoolWithZeroQuoteTokenReverts() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        vm.prank(owner);
        vm.expectRevert(XCupLeagueRegistry.InvalidToken.selector);
        registry.registerPool(poolOne, BRA, Currency.wrap(fanToken), Currency.wrap(address(0)));
    }

    function test_PoolReadHelpersReturnExpectedValuesAfterRegistration() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");
        _registerPool(poolOne, BRA, Currency.wrap(fanToken), Currency.wrap(quoteToken));

        vm.prank(owner);
        registry.setMatchState(BRA, XCupLeagueRegistry.MatchState.GOAL_SHOCK, "goal");

        assertTrue(registry.isRegisteredPool(poolOne));
        assertFalse(registry.isRegisteredPool(poolTwo));
        assertEq(registry.getTeamByPool(poolOne), BRA);
        assertEq(uint8(registry.getMatchStateByPool(poolOne)), uint8(XCupLeagueRegistry.MatchState.GOAL_SHOCK));
    }

    function test_UnregisteredPoolReadsRevert() public {
        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.PoolNotRegistered.selector, poolOne));
        registry.getTeamByPool(poolOne);

        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.PoolNotRegistered.selector, poolOne));
        registry.getMatchStateByPool(poolOne);
    }

    function test_GetTeamIdsReturnsInsertionOrder() public {
        _registerTeam(BRA, "Brazil", "BRA", address(0xB0A1), "ipfs://bra");
        _registerTeam(ARG, "Argentina", "ARG", address(0xA461), "ipfs://arg");
        _registerTeam(FRA, "France", "FRA", address(0xF4A1), "ipfs://fra");

        bytes32[] memory ids = registry.getTeamIds();
        assertEq(ids.length, 3);
        assertEq(ids[0], BRA);
        assertEq(ids[1], ARG);
        assertEq(ids[2], FRA);
    }

    function test_DefaultOwnerCanSetMatchState() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        vm.prank(owner);
        registry.setMatchState(BRA, XCupLeagueRegistry.MatchState.LIVE_NORMAL, "kickoff");

        (XCupLeagueRegistry.MatchState state, string memory reason,,) = registry.matchStateOfTeam(BRA);
        assertEq(uint8(state), uint8(XCupLeagueRegistry.MatchState.LIVE_NORMAL));
        assertEq(reason, "kickoff");
    }

    function test_CurrentControllerCanSetMatchStateAndEmitEvent() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");
        uint64 updateTime = 1_777_777;
        vm.warp(updateTime);

        vm.expectEmit(true, false, false, true);
        emit MatchStateUpdated(BRA, XCupLeagueRegistry.MatchState.RED_CARD, "red card", updateTime);

        registry.setMatchState(BRA, XCupLeagueRegistry.MatchState.RED_CARD, "red card");

        (XCupLeagueRegistry.MatchState state, string memory reason, uint64 updatedAt, bool exists) =
            registry.matchStateOfTeam(BRA);
        assertEq(uint8(state), uint8(XCupLeagueRegistry.MatchState.RED_CARD));
        assertEq(reason, "red card");
        assertEq(updatedAt, updateTime);
        assertTrue(exists);
    }

    function test_SetMatchStateByUnauthorizedCallerReverts() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.NotController.selector, unauthorized));
        registry.setMatchState(BRA, XCupLeagueRegistry.MatchState.PENALTY, "penalty");
    }

    function test_SetMatchStateWithZeroTeamIdReverts() public {
        vm.expectRevert(XCupLeagueRegistry.InvalidTeamId.selector);
        registry.setMatchState(bytes32(0), XCupLeagueRegistry.MatchState.PENALTY, "penalty");
    }

    function test_SetMatchStateWithUnknownTeamReverts() public {
        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.TeamNotRegistered.selector, GER));
        registry.setMatchState(GER, XCupLeagueRegistry.MatchState.PENALTY, "penalty");
    }

    function test_SetControllerByOwnerEmitsAndUpdatesPermissions() public {
        _registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");

        vm.expectEmit(true, true, false, true);
        emit ControllerUpdated(address(this), controller);

        vm.prank(owner);
        registry.setController(controller);

        assertEq(registry.controller(), controller);

        vm.prank(controller);
        registry.setMatchState(BRA, XCupLeagueRegistry.MatchState.FINAL_WHISTLE, "full time");

        vm.expectRevert(abi.encodeWithSelector(XCupLeagueRegistry.NotController.selector, address(this)));
        registry.setMatchState(BRA, XCupLeagueRegistry.MatchState.PRE_MATCH, "reset");
    }

    function test_SetControllerRejectsZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert(XCupLeagueRegistry.InvalidController.selector);
        registry.setController(address(0));
    }

    function test_SetControllerByNonOwnerReverts() public {
        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, unauthorized));
        registry.setController(controller);
    }

    function _registerTeam(
        bytes32 teamId,
        string memory name,
        string memory symbol,
        address token,
        string memory metadataURI
    ) internal {
        vm.prank(owner);
        registry.registerTeam(teamId, name, symbol, token, metadataURI);
    }

    function _registerPool(PoolId poolId, bytes32 teamId, Currency fan, Currency quote) internal {
        vm.prank(owner);
        registry.registerPool(poolId, teamId, fan, quote);
    }
}
