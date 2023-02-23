import { ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, Pool } from '@uniswap/v3-sdk';

const secret = require('../.secret.json');

export
const Provider = new ethers.JsonRpcProvider(secret.rpcUrl);

export
const ChainId = 1;

export
const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export
const PoolFee = 500;

export
const TokenIn = new Token(
  ChainId,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether',
);

export
const TokenOut = new Token(
  ChainId,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD Coin',
);

export
const PoolContract = new ethers.Contract(
  computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: TokenIn,
    tokenB: TokenOut,
    fee: PoolFee,
  }),
  IUniswapV3PoolABI.abi,
  Provider,
);

export
const GetPool = async () => {
  const [liquidity, slot0] = await Promise.all([
    PoolContract.liquidity(),
    PoolContract.slot0(),
  ]);
  return new Pool(
    TokenIn,
    TokenOut,
    PoolFee,
    slot0[0].toString(),
    liquidity.toString(),
    Number(slot0[1]),
  );
};

async function main() {
  const pool = await GetPool();
  console.log(pool);
}

main();
