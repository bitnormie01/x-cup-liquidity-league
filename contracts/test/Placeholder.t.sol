// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {Placeholder} from "../src/Placeholder.sol";

contract PlaceholderTest is Test {
    function testSetX() public {
        Placeholder placeholder = new Placeholder();
        placeholder.setX(42);
        assertEq(placeholder.x(), 42);
    }
}
