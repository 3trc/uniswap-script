import 'global-agent/bootstrap';
import { createERC20, ERC20 } from './lib/erc20';
import { Wallet } from './lib/runner';
import { createPoolContract, createPool, createRoute, getOutputQuote, createTrade, createTradeTransaction } from './lib/uniswap';

async function trade(
  assets: ERC20,
  funds: ERC20,
  amountIn: bigint,
  side: 'buy' | 'sell',
) {
  const tokenIn = side === 'buy' ? funds : assets;
  const tokenOut = side === 'buy' ? assets : funds;
  const poolContract = createPoolContract(tokenIn, tokenOut);
  const pool = await createPool(poolContract, tokenIn, tokenOut);
  const route = createRoute(pool, tokenIn, tokenOut);
  const amountOut = await getOutputQuote(tokenIn, amountIn, route);
  const trade = createTrade(tokenIn, amountIn, tokenOut, amountOut, route);
  console.log(
    tokenIn.Format(amountIn),
    tokenIn.Token.symbol, '->',
    tokenOut.Format(amountOut),
    tokenOut.Token.symbol,
  );
  const data = createTradeTransaction(trade);
  console.log('发送交易...');
  const trsp = await Wallet.sendTransaction(data);
  console.log('确认交易...');
  const trcp = await trsp.wait();
  console.log('结束');
}

async function main() {
  const [WETH, UNI] = await Promise.all([
    createERC20('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 5, Wallet),
    createERC20('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 5, Wallet),
  ]);
  const tokenInBalance = await WETH.balanceOf(Wallet.address);
  trade(UNI, WETH, tokenInBalance, 'buy');
}

main();
