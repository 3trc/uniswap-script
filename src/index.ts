import { ethers } from 'ethers';
import { computePoolAddress } from '@uniswap/v3-sdk';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { Token } from '@uniswap/sdk-core';
import { ContractRunner } from 'ethers/types/providers';



const secret = require('../.secret.json');

async function createToken(
  address: string,
  runner?: ContractRunner | null | undefined,
  chainId = 1,
) {
  const erc20 = new ethers.Contract(address, ERC20_ABI.abi, runner);
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
  const address = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
  const token = await createToken(address, provider, 1);
  console.log(token);
}

main();
