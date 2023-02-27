import { Token } from '@uniswap/sdk-core';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ethers } from 'ethers';
import { ContractRunner } from 'ethers/types/providers';

export
async function CreateERC20(address: string, chainId: number, runner: ContractRunner) {
  const contract = new ethers.Contract(address, ERC20_ABI.abi, runner);
  const [symbol, name, decimals]: [string, string, bigint] = await Promise.all([
    contract.symbol(),
    contract.name(),
    contract.decimals(),
  ]);
  return new ERC20(runner, chainId, address, Number(decimals), symbol, name);
}

export
class ERC20 {
  public constructor(
    private runner: ContractRunner,
    ...args: ConstructorParameters<typeof Token>
  ) {
    this.token = new Token(...args);
    this.contract = new ethers.Contract(this.token.address, ERC20_ABI.abi, this.runner);
  }

  private token: Token;
  private contract: ethers.Contract;

  public get Token() {
    return this.token;
  }

  public get Contract() {
    return this.contract;
  }

  public async balanceOf(address: string) {
    return await this.contract.balanceOf(address);
  }

  public async allowance(owner: string, spender: string) {
    return await this.contract.allowance(owner, spender);
  }

  public async approve(spender: string, amount: ethers.BigNumberish) {
    return await this.contract.approve(spender, amount);
  }
}
