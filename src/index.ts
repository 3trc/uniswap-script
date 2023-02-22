import { ethers } from 'ethers';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';



const secret = require('../.secret.json');

async function main() {
  const provider = new ethers.JsonRpcProvider(secret.rpcUrl);
  const wallet = new ethers.Wallet(secret.privateKey, provider);
  console.log('你好，世界');
  console.log(wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log(balance);
  const uniToken = new ethers.Contract(
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    ERC20_ABI.abi,
    provider,
  );
  const a = await uniToken.symbol();
  console.log(a);
}

main();
