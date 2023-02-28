import { computePoolAddress } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import 'global-agent/bootstrap';
import { CreateERC20 } from './lib/erc20';
import { Provider, Wallet } from './lib/runner';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { CreatePoolContract } from './lib/uniswap';


async function main() {
  const [tokenIn, tokenOut] = await Promise.all([
    CreateERC20('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 5, Wallet),
    CreateERC20('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 5, Wallet),
  ]);
  console.log(tokenIn.Token);
  console.log(tokenOut.Token);
  const poolContract = CreatePoolContract(tokenIn, tokenOut);
  console.log(poolContract);
}

main();
