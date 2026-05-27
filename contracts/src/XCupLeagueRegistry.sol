// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";

contract XCupLeagueRegistry is Ownable {
    enum MatchState {
        PRE_MATCH,
        LIVE_NORMAL,
        GOAL_SHOCK,
        RED_CARD,
        PENALTY,
        FINAL_WHISTLE
    }

    struct Team {
        string name;
        string symbol;
        address token;
        string metadataURI;
        bool exists;
    }

    struct PoolConfig {
        bytes32 teamId;
        Currency fanToken;
        Currency quoteToken;
        bool exists;
    }

    struct MatchStateData {
        MatchState state;
        string reason;
        uint64 updatedAt;
        bool exists;
    }

    mapping(bytes32 => Team) public teams;
    mapping(PoolId => PoolConfig) public poolConfig;
    mapping(bytes32 => MatchStateData) public matchStateOfTeam;
    bytes32[] public teamIds;
    address public controller;

    error InvalidTeamId();
    error InvalidToken();
    error InvalidController();
    error TeamAlreadyRegistered(bytes32 teamId);
    error TeamNotRegistered(bytes32 teamId);
    error PoolAlreadyRegistered(PoolId poolId);
    error PoolNotRegistered(PoolId poolId);
    error NotController(address caller);

    event TeamRegistered(bytes32 indexed teamId, string name, string symbol, address indexed token, string metadataURI);
    event PoolRegistered(PoolId indexed poolId, bytes32 indexed teamId, Currency fanToken, Currency quoteToken);
    event MatchStateUpdated(bytes32 indexed teamId, MatchState state, string reason, uint64 updatedAt);
    event ControllerUpdated(address indexed oldController, address indexed newController);

    constructor(address owner_) Ownable(owner_) {
        controller = msg.sender;
    }

    modifier onlyController() {
        if (msg.sender != controller && msg.sender != owner()) {
            revert NotController(msg.sender);
        }
        _;
    }

    function registerTeam(
        bytes32 teamId,
        string calldata name,
        string calldata symbol,
        address token,
        string calldata metadataURI
    ) external onlyOwner {
        if (teamId == bytes32(0)) {
            revert InvalidTeamId();
        }
        if (token == address(0)) {
            revert InvalidToken();
        }
        if (teams[teamId].exists) {
            revert TeamAlreadyRegistered(teamId);
        }

        teams[teamId] = Team({name: name, symbol: symbol, token: token, metadataURI: metadataURI, exists: true});
        teamIds.push(teamId);
        matchStateOfTeam[teamId] =
            MatchStateData({state: MatchState.PRE_MATCH, reason: "", updatedAt: uint64(block.timestamp), exists: true});

        emit TeamRegistered(teamId, name, symbol, token, metadataURI);
    }

    function registerPool(PoolId poolId, bytes32 teamId, Currency fanToken, Currency quoteToken) external onlyOwner {
        if (teamId == bytes32(0)) {
            revert InvalidTeamId();
        }
        if (!teams[teamId].exists) {
            revert TeamNotRegistered(teamId);
        }
        if (poolConfig[poolId].exists) {
            revert PoolAlreadyRegistered(poolId);
        }
        if (Currency.unwrap(fanToken) == address(0) || Currency.unwrap(quoteToken) == address(0)) {
            revert InvalidToken();
        }

        poolConfig[poolId] = PoolConfig({teamId: teamId, fanToken: fanToken, quoteToken: quoteToken, exists: true});

        emit PoolRegistered(poolId, teamId, fanToken, quoteToken);
    }

    function setMatchState(bytes32 teamId, MatchState state, string calldata reason) external onlyController {
        if (teamId == bytes32(0)) {
            revert InvalidTeamId();
        }
        if (!teams[teamId].exists) {
            revert TeamNotRegistered(teamId);
        }

        uint64 updatedAt = uint64(block.timestamp);
        matchStateOfTeam[teamId] = MatchStateData({state: state, reason: reason, updatedAt: updatedAt, exists: true});

        emit MatchStateUpdated(teamId, state, reason, updatedAt);
    }

    function setController(address newController) external onlyOwner {
        if (newController == address(0)) {
            revert InvalidController();
        }

        address oldController = controller;
        controller = newController;

        emit ControllerUpdated(oldController, newController);
    }

    function getTeamIds() external view returns (bytes32[] memory) {
        return teamIds;
    }

    function getTeamByPool(PoolId poolId) external view returns (bytes32 teamId) {
        PoolConfig storage config = poolConfig[poolId];
        if (!config.exists) {
            revert PoolNotRegistered(poolId);
        }
        return config.teamId;
    }

    function getMatchStateByPool(PoolId poolId) external view returns (MatchState) {
        PoolConfig storage config = poolConfig[poolId];
        if (!config.exists) {
            revert PoolNotRegistered(poolId);
        }
        return matchStateOfTeam[config.teamId].state;
    }

    function isRegisteredPool(PoolId poolId) external view returns (bool) {
        return poolConfig[poolId].exists;
    }
}
