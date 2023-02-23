import { ethers } from 'ethers';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { Token } from '@uniswap/sdk-core';
import { computePoolAddress, Pool } from '@uniswap/v3-sdk';

const secret = require('../.secret.json');

export
const provider = new ethers.JsonRpcProvider(secret.rpcUrl);

export
const chainId = 1;

export
const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export
const fee = 500;

export
function createERC20Contract(address: string) {
  return new ethers.Contract(address, ERC20_ABI.abi, provider);
}

export
async function createERC20Token(address: string) {
  const erc20 = createERC20Contract(address);
  const [symbol, name, decimals]: [string, string, bigint] = await Promise.all([
    erc20.symbol(),
    erc20.name(),
    erc20.decimals(),
  ]);
  return new Token(chainId, address, Number(decimals), symbol, name);
}

export
async function createPoolContract(tokenInAddress: string, tokenOutAddress: string) {
  const [tokenIn, tokenOut] = await Promise.all([
    createERC20Token(tokenInAddress),
    createERC20Token(tokenOutAddress),
  ]);
  const poolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: fee,
  });
  return new ethers.Contract(poolAddress, IUniswapV3PoolABI.abi, provider);
}

export
async function getPoolInfo(tokenInAddress: string, tokenOutAddress: string) {
  const poolContract = await createPoolContract(tokenInAddress, tokenOutAddress);
  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

export
async function createPool(tokenInAddress: string, tokenOutAddress: string) {
  const [tokenIn, tokenOut] = await Promise.all([
    createERC20Token(tokenInAddress),
    createERC20Token(tokenOutAddress),
  ]);
  const poolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: fee,
  });
  const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI.abi, provider);
  const [token0, token1, poolFee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
  return new Pool(
    tokenIn,
    tokenOut,
    fee,
    slot0[0].toString(),
    liquidity.toString(),
    Number(slot0[1]),
  );
}
