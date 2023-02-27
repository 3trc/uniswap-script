import { ethers } from 'ethers';
import 'global-agent/bootstrap';
import { CreateERC20 } from './lib/erc20';
import { Wallet } from './lib/runner';


async function main() {
  const token = await CreateERC20('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 5, Wallet);
  const t = await token.approve('0xE592427A0AEce92De3Edee1F18E0157C05861564', ethers.parseEther('0'));
  console.log(t);
  await t.wait();
  console.log('done');
}

main();
