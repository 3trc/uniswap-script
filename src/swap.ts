import { Token } from "@uniswap/sdk-core";

export
const ChainId = 1;

export
const TokenIN = new Token(
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

async function main() {

}

main();
