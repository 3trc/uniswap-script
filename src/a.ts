import 'global-agent/bootstrap';
import { createERC20 } from './lib/erc20';
import { Wallet } from './lib/runner';
import { createPoolContract, createPool, createRoute, getOutputQuote, createTrade } from './lib/uniswap';

async function main() {
  const [tokenIn, tokenOut] = await Promise.all([
    createERC20('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 5, Wallet),
    createERC20('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 5, Wallet),
  ]);
  const amountIn = tokenIn.Parse('1');
  const poolContract = createPoolContract(tokenIn, tokenOut);
  const pool = await createPool(poolContract, tokenIn, tokenOut);
  const route = createRoute(pool, tokenIn, tokenOut);
  const amountOut = await getOutputQuote(tokenIn, amountIn, route);
  const trade = createTrade(tokenIn, amountIn, tokenOut, amountOut, route);
}

main();
