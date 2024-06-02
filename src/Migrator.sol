//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IUniswapV2Pair.sol";

import "forge-std/console.sol";

import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {PoolModifyLiquidityTest} from "v4-core/src/test/PoolModifyLiquidityTest.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {LiquidityAmounts} from "v4-periphery/libraries/LiquidityAmounts.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolManager} from "v4-core/src/PoolManager.sol";

contract Migrator {
    using CurrencyLibrary for Currency;
    
    IUniswapV2Router02 constant ROUTER = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); 
    address constant HOOK_ADDRESS = address(0x3CA2cD9f71104a6e1b67822454c725FcaeE35fF6); // address of the hook contract deployed to goerli -- you can use this hook address or deploy your own!
    PoolModifyLiquidityTest lpRouter = PoolModifyLiquidityTest(address(0x83feDBeD11B3667f40263a88e8435fca51A03F8C));
    IPoolManager manager;

    constructor() {
        manager = new PoolManager(500_000);
    }

    function migrate(address _pool, uint256 liquidity) external returns (uint256 amountA, uint256 amountB) {
        IUniswapV2Pair sushiPool = IUniswapV2Pair(_pool);

        console.log("");
        console.log("Removing Liquidity");

        sushiPool.transferFrom(msg.sender, _pool, liquidity);
        (amountA, amountB) = sushiPool.burn(address(this));

        console.log("wETH Amount", amountA);
        console.log("USDC Amount", amountB);
        console.log("");

        address tokenA = sushiPool.token0();
        address tokenB = sushiPool.token1();

        address token0 = uint160(tokenA) < uint160(tokenB) ? tokenA : tokenB;
        address token1 = uint160(tokenA) < uint160(tokenB) ? tokenB : tokenA;
        uint24 swapFee = 4000; // 0.40% fee tier
        int24 tickSpacing = 10;

        PoolKey memory pool = PoolKey({
            currency0: Currency.wrap(token0),
            currency1: Currency.wrap(token1),
            fee: swapFee,
            tickSpacing: tickSpacing,
            hooks: IHooks(address(0))
        });

        manager.initialize(pool, 3800e18, "");

        IERC20(token0).approve(address(lpRouter), type(uint256).max);
        IERC20(token1).approve(address(lpRouter), type(uint256).max);

        // optionally specify hookData if the hook depends on arbitrary data for liquidity modification
        bytes memory hookData = new bytes(0);

        // logging the pool ID
        PoolId id = PoolIdLibrary.toId(pool);
        bytes32 idBytes = PoolId.unwrap(id);
        console.log("Pool ID");
        console.logBytes32(bytes32(idBytes));


        uint160 price = uint160(sqrt(3800) * 2**96);

        /*
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            price,
            price,
            price,
            amountA,
            amountB
        );
        */

        int24 minTick = TickMath.minUsableTick(tickSpacing);
        int24 maxTick = TickMath.maxUsableTick(tickSpacing);

        lpRouter.modifyLiquidity(
            pool,
            IPoolManager.ModifyLiquidityParams(
                minTick,
                maxTick,
                int256(uint256(price)),
                0),
            hookData);
    }

    function sqrt(uint x) internal pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

}


