import 'global-agent/bootstrap';
import { createERC20 } from './lib/erc20';
import { Wallet } from './lib/runner';
import { createPoolContract, createPool, createRoute } from './lib/uniswap';

async function main() {
  const [tokenIn, tokenOut] = await Promise.all([
    createERC20('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 5, Wallet),
    createERC20('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 5, Wallet),
  ]);
  console.log(tokenIn.Token);
  console.log(tokenOut.Token);
  const poolContract = createPoolContract(tokenIn, tokenOut);
  const pool = await createPool(poolContract, tokenIn, tokenOut);
  console.log(pool);
  const route = createRoute(pool, tokenIn, tokenOut);
  console.log(route);
}

main();
