import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, Pool, Route, SwapQuoter } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { ERC20 } from './erc20';
import { Provider, Wallet } from './runner';

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const POOL_FEE = 500;

const QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

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
  amount: string,
  route: Route<Currency, Currency>,
) {
  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(tokenIn.Token, tokenIn.Parse(amount).toString()),
    0,
    {
      useQuoterV2: true,
    },
  );
  const quoteCallReturnData = await Provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });
  return new ethers.AbiCoder().decode(['uint256'], quoteCallReturnData);
}
