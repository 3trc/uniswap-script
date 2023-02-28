import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { ERC20 } from './erc20';
import { Wallet } from './runner';

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const POOL_FEE = 500;

export
function CreatePoolContract(tokenIn: ERC20, tokenOut: ERC20) {
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
