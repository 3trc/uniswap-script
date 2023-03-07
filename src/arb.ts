import { createERC20 } from './lib/erc20';
import { Wallet, Provider } from './lib/runner';


async function main() {
  const [USDC, WETH] = await Promise.all([
    createERC20('0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', 42161, Wallet),
    createERC20('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 42161, Wallet),
  ]);
  const balance = await WETH.balanceOf(Wallet.address);
  console.log(WETH.Format(balance));
  const balance2 = await USDC.balanceOf(Wallet.address);
  console.log(USDC.Format(balance2));
}

main();
