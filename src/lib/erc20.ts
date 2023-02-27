import { Token } from '@uniswap/sdk-core';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ethers } from 'ethers';
import { ContractRunner } from 'ethers/types/providers';

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
}
