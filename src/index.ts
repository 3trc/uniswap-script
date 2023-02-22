import { ethers } from 'ethers';
import { computePoolAddress } from '@uniswap/v3-sdk';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
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
    createToken('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', provider, 1),
    createToken('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', provider, 1),
  ]);
  console.log(tokenIn, tokenOut);
}

main();
