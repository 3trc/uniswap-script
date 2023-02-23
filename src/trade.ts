import { Pool } from '@uniswap/v3-sdk';
import { createERC20Token, createPool, getPoolInfo } from './erc20';

async function swap(tokenInAddress: string, tokenOutAddress: string) {
  const [tokenIn, tokenOut] = await Promise.all([
    createERC20Token(tokenInAddress),
    createERC20Token(tokenOutAddress),
  ]);
  console.log(tokenIn, tokenOut);
}

async function main() {
  swap('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
}

main();

