// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolModifyLiquidityTest} from "v4-core/src/test/PoolModifyLiquidityTest.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";

import "src/Migrator.sol";
import "src/interfaces/IUniswapV2Pair.sol";

contract AddLiquidityScript is Test {
    using CurrencyLibrary for Currency;

    Migrator migrator;
    IUniswapV2Pair pool = IUniswapV2Pair(0x397FF1542f962076d0BFE58eA045FfA2d347ACa0);

    function setUp() external {
        migrator = new Migrator();

        console.log("MIGRATOR DEPLOYED");
        console.log(address(migrator));
    }

    function test_migrate_liquidity() public {
        address user = 0x7Af84431A81C43F9289421735202C273fB923a44;

        uint256 userBalance = pool.balanceOf(user);

        vm.startPrank(user);
        pool.approve(address(migrator), userBalance);
        migrator.migrate(address(pool), userBalance);
        vm.stopPrank();

        assertEq(pool.balanceOf(user), 0);

    }
}
