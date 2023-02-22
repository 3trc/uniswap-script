import { ethers } from 'ethers';

const secret = require('../.secret.json');

async function main() {
  const provider = new ethers.JsonRpcProvider(secret.rpcUrl);
  const wallet = new ethers.Wallet(secret.privateKey, provider);
  console.log('你好，世界');
  console.log(wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log(balance);
}

main();
