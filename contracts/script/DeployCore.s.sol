// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {PoolManager} from "@uniswap/v4-core/PoolManager.sol";
import {TeamPassport} from "../src/TeamPassport.sol";
import {XCupLeagueRegistry} from "../src/XCupLeagueRegistry.sol";
import {XCupLiquidityLeagueHook} from "../src/XCupLiquidityLeagueHook.sol";
import {HookFlagsHelper} from "./utils/HookFlagsHelper.sol";
import {HookCreate2Deployer} from "./utils/HookCreate2Deployer.sol";

contract DeployCore is Script {
    struct TokenTeam {
        string name;
        string symbol;
        address token;
        bytes32 teamId;
    }

    struct CoreDeployments {
        address poolManager;
        string poolManagerMode;
        address registry;
        address passport;
        address hook;
        bytes32 hookSalt;
    }

    error HookSaltNotFound();
    error PoolManagerAddressRequired();
    error HookFlagMismatch(address hook, uint160 actualFlags, uint160 requiredFlags);
    error HookCodeMissing(address hook);

    function run() external {
        string memory outputDir = _deploymentDir();
        string memory tokensPath = string.concat(outputDir, "/tokens.json");
        string memory tokensJson = vm.readFile(tokensPath);
        TokenTeam[] memory teams = _readTeams(tokensJson);

        vm.createDir(outputDir, true);

        vm.startBroadcast();
        address owner = msg.sender;

        XCupLeagueRegistry registry = new XCupLeagueRegistry(owner);
        TeamPassport passport = new TeamPassport(owner);
        IPoolManager poolManager = _resolvePoolManager(owner);
        HookCreate2Deployer hookDeployer = new HookCreate2Deployer();

        bytes memory hookCreationCode = abi.encodePacked(
            type(XCupLiquidityLeagueHook).creationCode, abi.encode(poolManager, registry, passport, owner)
        );
        (bytes32 salt,) = _findHookSalt(address(hookDeployer), HookFlagsHelper.requiredFlags(), hookCreationCode);
        XCupLiquidityLeagueHook hook = hookDeployer.deploy(salt, poolManager, registry, passport, owner);
        _assertHookFlags(address(hook));

        for (uint256 i = 0; i < teams.length; i++) {
            registry.registerTeam(teams[i].teamId, teams[i].name, teams[i].symbol, teams[i].token, "");
        }

        vm.stopBroadcast();

        CoreDeployments memory deployments = CoreDeployments({
            poolManager: address(poolManager),
            poolManagerMode: _poolManagerMode(),
            registry: address(registry),
            passport: address(passport),
            hook: address(hook),
            hookSalt: salt
        });
        vm.writeFile(string.concat(outputDir, "/core.json"), _coreJson(deployments, teams));
    }

    function _resolvePoolManager(address owner) internal returns (IPoolManager) {
        address poolManagerAddr = vm.envOr("POOL_MANAGER_ADDRESS", address(0));
        if (poolManagerAddr != address(0)) {
            return IPoolManager(poolManagerAddr);
        }
        bool deployOwnPoolManager = vm.envOr("DEPLOY_OWN_POOL_MANAGER", false);
        if (block.chainid != 31337 && !deployOwnPoolManager) {
            revert PoolManagerAddressRequired();
        }

        return IPoolManager(address(new PoolManager(owner)));
    }

    function _findHookSalt(address deployer, uint160 requiredFlags, bytes memory creationCodeWithArgs)
        internal
        pure
        returns (bytes32 salt, address hookAddress)
    {
        bytes32 initCodeHash = keccak256(creationCodeWithArgs);
        uint160 mask = HookFlagsHelper.hookMask();

        for (uint256 i = 0; i < 200_000; i++) {
            bytes32 candidate = bytes32(i);
            address predicted =
                address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), deployer, candidate, initCodeHash)))));
            if ((uint160(predicted) & mask) == requiredFlags) {
                return (candidate, predicted);
            }
        }

        revert HookSaltNotFound();
    }

    function _assertHookFlags(address hook) internal view {
        if (hook.code.length == 0) {
            revert HookCodeMissing(hook);
        }

        uint160 actualFlags = uint160(hook) & HookFlagsHelper.hookMask();
        uint160 requiredFlags = HookFlagsHelper.requiredFlags();
        if (actualFlags != requiredFlags) {
            revert HookFlagMismatch(hook, actualFlags, requiredFlags);
        }
    }

    function _readTeams(string memory tokensJson) internal pure returns (TokenTeam[] memory teams) {
        teams = new TokenTeam[](4);
        teams[0] = _readTeam(tokensJson, 0);
        teams[1] = _readTeam(tokensJson, 1);
        teams[2] = _readTeam(tokensJson, 2);
        teams[3] = _readTeam(tokensJson, 3);
    }

    function _readTeam(string memory tokensJson, uint256 index) internal pure returns (TokenTeam memory) {
        string memory prefix = string.concat(".teams[", vm.toString(index), "]");
        string memory symbol = vm.parseJsonString(tokensJson, string.concat(prefix, ".symbol"));
        string memory name = vm.parseJsonString(tokensJson, string.concat(prefix, ".name"));
        address token = vm.parseJsonAddress(tokensJson, string.concat(prefix, ".address"));

        return TokenTeam({name: name, symbol: symbol, token: token, teamId: keccak256(bytes(symbol))});
    }

    function _deploymentDir() internal view returns (string memory) {
        return string.concat("../deployments/", vm.toString(block.chainid));
    }

    function _poolManagerMode() internal view returns (string memory) {
        if (vm.envOr("POOL_MANAGER_ADDRESS", address(0)) != address(0)) {
            return "external";
        }

        return "project-owned";
    }

    function _coreJson(CoreDeployments memory deployments, TokenTeam[] memory teams)
        internal
        view
        returns (string memory)
    {
        return string.concat(
            "{\n",
            '  "chainId": ',
            vm.toString(block.chainid),
            ",\n",
            '  "poolManager": "',
            vm.toString(deployments.poolManager),
            '",\n',
            '  "poolManagerMode": "',
            deployments.poolManagerMode,
            '",\n',
            '  "registry": "',
            vm.toString(deployments.registry),
            '",\n',
            '  "passport": "',
            vm.toString(deployments.passport),
            '",\n',
            '  "hook": "',
            vm.toString(deployments.hook),
            '",\n',
            '  "hookSalt": "',
            vm.toString(deployments.hookSalt),
            '",\n',
            '  "teams": [\n',
            _teamJson(teams[0], true),
            _teamJson(teams[1], true),
            _teamJson(teams[2], true),
            _teamJson(teams[3], false),
            "  ]\n",
            "}\n"
        );
    }

    function _teamJson(TokenTeam memory team, bool addComma) internal pure returns (string memory) {
        return string.concat(
            '    { "symbol": "',
            team.symbol,
            '", "teamId": "',
            vm.toString(team.teamId),
            '", "token": "',
            vm.toString(team.token),
            '" }',
            addComma ? "," : "",
            "\n"
        );
    }
}
