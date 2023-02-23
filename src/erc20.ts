import { ethers } from 'ethers';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ContractRunner } from 'ethers/types/providers';
import { Token } from '@uniswap/sdk-core';

const secret = require('../.secret.json');

export
const provider = new ethers.JsonRpcProvider(secret.rpcUrl);

export
const chainId = 1;

export
function createERC20Contract(address: string) {
  return new ethers.Contract(address, ERC20_ABI.abi, provider);
}

export
async function createERC20Token(address: string) {
  const erc20 = createERC20Contract(address);
  const [symbol, name, decimals]: [string, string, bigint] = await Promise.all([
    erc20.symbol(),
    erc20.name(),
    erc20.decimals(),
  ]);
  return new Token(chainId, address, Number(decimals), symbol, name);
}
