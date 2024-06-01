//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IUniswapV2Pair.sol";

import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {PoolModifyLiquidityTest} from "v4-core/src/test/PoolModifyLiquidityTest.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";

contract Migrator {
    using CurrencyLibrary for Currency;
    
    IUniswapV2Router02 constant ROUTER = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); 
    address constant HOOK_ADDRESS = address(0x3CA2cD9f71104a6e1b67822454c725FcaeE35fF6); // address of the hook contract deployed to goerli -- you can use this hook address or deploy your own!

    PoolModifyLiquidityTest lpRouter = PoolModifyLiquidityTest(address(0x83feDBeD11B3667f40263a88e8435fca51A03F8C));

    function migrate(address _pool, uint256 liquidity) external returns (uint256 amountA, uint256 amountB) {
        IUniswapV2Pair sushiPool = IUniswapV2Pair(_pool);

        sushiPool.transferFrom(msg.sender, _pool, liquidity);
        (amountA, amountB) = sushiPool.burn(address(this));

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
            hooks: IHooks(HOOK_ADDRESS)
        });

        IERC20(token0).approve(address(lpRouter), type(uint256).max);
        IERC20(token1).approve(address(lpRouter), type(uint256).max);

        // optionally specify hookData if the hook depends on arbitrary data for liquidity modification
        bytes memory hookData = new bytes(0);

        // logging the pool ID
        PoolId id = PoolIdLibrary.toId(pool);
        bytes32 idBytes = PoolId.unwrap(id);
        // console.logBytes32(bytes32(idBytes));

        // Provide 10_000e18 worth of liquidity on the range of [-600, 600]
        lpRouter.modifyLiquidity(pool, IPoolManager.ModifyLiquidityParams(-600, 600, 10_000e18, 0), hookData);

    }

}


