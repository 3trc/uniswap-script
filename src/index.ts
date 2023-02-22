import { ethers } from 'ethers';
import { computePoolAddress } from '@uniswap/v3-sdk';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { Token } from '@uniswap/sdk-core';
import { ContractRunner } from 'ethers/types/providers';



const secret = require('../.secret.json');

function createERC20(
  address: string,
  runner?: ContractRunner | null | undefined,
) {
  return new ethers.Contract(address, ERC20_ABI.abi, runner);
}

async function createToken(
  address: string,
  runner?: ContractRunner | null | undefined,
  chainId = 1,
) {
  const erc20 = createERC20(address, runner);
  const [symbol, name, decimals]: [string, string, bigint] = await Promise.all([
    erc20.symbol(),
    erc20.name(),
    erc20.decimals(),
  ]);
  return new Token(chainId, address, Number(decimals), symbol, name);
}

async function main() {
  const provider = new ethers.JsonRpcProvider(secret.rpcUrl);
  const wallet = new ethers.Wallet(secret.privateKey, provider);
  console.log(wallet.address);
  const [tokenIn, tokenOut] = await Promise.all([
    createToken('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', provider, 5),
    createToken('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', provider, 5),
  ]);
  console.log(tokenIn, tokenOut);
  const poolAddress = computePoolAddress({
    factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: 3000,
  });
  console.log(poolAddress);
  const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI.abi, provider);
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);
  console.log(token0, token1, fee);
  const quoterContract = new ethers.Contract(
    '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    Quoter.abi,
    provider,
  );

  const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
    token0,
    token1,
    fee,
    ethers.parseUnits('1', 18).toString(),
    0,
  );
  console.log(quotedAmountOut);
}

main();
