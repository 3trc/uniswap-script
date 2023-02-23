import { createPoolContract } from './erc20';

async function swap(tokenInAddress: string, tokenOutAddress: string) {
  const poolContract = await createPoolContract(tokenInAddress, tokenOutAddress);
  console.log(poolContract);
}

async function main() {
  swap('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
}

main();

