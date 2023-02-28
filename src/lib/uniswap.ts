import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, Pool, Route } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { ERC20 } from './erc20';
import { Wallet } from './runner';

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const POOL_FEE = 500;

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
