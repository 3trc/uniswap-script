import { ethers } from 'ethers';
import 'global-agent/bootstrap';
import { CreateERC20 } from './lib/erc20';
import { Wallet } from './lib/runner';


async function main() {
  const token = await CreateERC20('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 5, Wallet);
  
  const a = await token.balanceOf('0xb7f6C414154444dbC4308A0cD818B6C031B6bDED');
  console.log(a);
  console.log(token.Format(a));
  // const t = await token.approve('0x000000000022d473030f116ddee9f6b43ac78ba3', ethers.parseEther('0'));
  // console.log(t);
  // await t.wait();
  // console.log('done');
}

main();
