// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {DemoFanToken} from "../src/DemoFanToken.sol";
import {DemoQuoteToken} from "../src/DemoQuoteToken.sol";

contract DeployTokens is Script {
    struct TeamToken {
        string name;
        string symbol;
        address token;
    }

    function run() external {
        string memory outputDir = _deploymentDir();
        vm.createDir(outputDir, true);

        vm.startBroadcast();
        address owner = msg.sender;

        DemoQuoteToken quote = new DemoQuoteToken(owner);
        TeamToken[] memory teams = new TeamToken[](4);
        teams[0] = _deployFanToken("Brazil Fan Token", "BRA", owner);
        teams[1] = _deployFanToken("Argentina Fan Token", "ARG", owner);
        teams[2] = _deployFanToken("France Fan Token", "FRA", owner);
        teams[3] = _deployFanToken("Germany Fan Token", "GER", owner);

        vm.stopBroadcast();

        vm.writeFile(string.concat(outputDir, "/tokens.json"), _tokensJson(address(quote), teams));
    }

    function _deployFanToken(string memory name, string memory symbol, address owner)
        internal
        returns (TeamToken memory)
    {
        DemoFanToken token = new DemoFanToken(name, symbol, owner);
        return TeamToken({name: name, symbol: symbol, token: address(token)});
    }

    function _deploymentDir() internal view returns (string memory) {
        return string.concat("../deployments/", vm.toString(block.chainid));
    }

    function _tokensJson(address quote, TeamToken[] memory teams) internal view returns (string memory) {
        return string.concat(
            "{\n",
            '  "chainId": ',
            vm.toString(block.chainid),
            ",\n",
            '  "quote": { "symbol": "xUSD", "address": "',
            vm.toString(quote),
            '" },\n',
            '  "teams": [\n',
            _teamJson(teams[0], true),
            _teamJson(teams[1], true),
            _teamJson(teams[2], true),
            _teamJson(teams[3], false),
            "  ]\n",
            "}\n"
        );
    }

    function _teamJson(TeamToken memory team, bool addComma) internal pure returns (string memory) {
        return string.concat(
            '    { "symbol": "',
            team.symbol,
            '", "name": "',
            team.name,
            '", "address": "',
            vm.toString(team.token),
            '" }',
            addComma ? "," : "",
            "\n"
        );
    }
}
