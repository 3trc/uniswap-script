import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { ERC20 } from './erc20';
import { Provider, Wallet } from './runner';

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const POOL_FEE = 500;

const QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

const MAX_PRIORITY_FEE_PER_GAS = 100000000000;

const MAX_FEE_PER_GAS = 100000000000;

const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

export
function createPoolContract(tokenIn: ERC20, tokenOut: ERC20) {
  return new ethers.Contract(
    computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: tokenIn.Token,
      tokenB: tokenOut.Token,
      fee: POOL_FEE,
    }),
    IUniswapV3PoolABI.abi,
    Wallet,
  );
}

export
async function createPool(
  poolContract: ethers.Contract,
  tokenIn: ERC20,
  tokenOut: ERC20,
) {
  const [liquidity, slot0] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);
  return new Pool(
    tokenIn.Token,
    tokenOut.Token,
    POOL_FEE,
    slot0[0].toString(),
    liquidity.toString(),
    Number(slot0[1]),
  );
};

export
function createRoute(
  pool: Pool,
  tokenIn: ERC20,
  tokenOut: ERC20,
) {
  return new Route([pool], tokenIn.Token, tokenOut.Token);
}

export
async function getOutputQuote(
  tokenIn: ERC20,
  amountIn: bigint,
  route: Route<Currency, Currency>,
) {
  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(tokenIn.Token, amountIn.toString()),
    0,
    {
      useQuoterV2: true,
    },
  );
  const quoteCallReturnData = await Provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });
  return new ethers.AbiCoder().decode(['uint256'], quoteCallReturnData)[0] as bigint;
}

export
function createTrade(
  tokenIn: ERC20,
  amountIn: bigint,
  tokenOut: ERC20,
  amountOut: bigint,
  route: Route<Currency, Currency>,
) {
  return Trade.createUncheckedTrade({
    route,
    inputAmount: CurrencyAmount.fromRawAmount(tokenIn.Token, amountIn.toString()),
    outputAmount: CurrencyAmount.fromRawAmount(tokenOut.Token, amountOut.toString()),
    tradeType: 0,
  });
}

export
function createTradeTransaction(trade: Trade<Currency, Currency, 0>) {
  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    recipient: Wallet.address,
  };
  const methodParameters = SwapRouter.swapCallParameters([trade], options);
  return {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: Wallet.address,
    // maxFeePerGas: MAX_FEE_PER_GAS,
    // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };
}
