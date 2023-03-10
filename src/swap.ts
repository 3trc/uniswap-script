import 'global-agent/bootstrap';
import { ethers } from 'ethers';
import { Currency, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core';
import ERC20_ABI from '@openzeppelin/contracts/build/contracts/ERC20.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade } from '@uniswap/v3-sdk';

const secret = require('../.secret.json');

export
const Provider = new ethers.JsonRpcProvider(secret.rpcUrl);

export
const Wallet = new ethers.Wallet(secret.privateKey, Provider);

export
const ChainId = 5;

export
const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export
const QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

export
const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

export
const MAX_PRIORITY_FEE_PER_GAS = 100000000000;

export
const MAX_FEE_PER_GAS = 100000000000

export
const PoolFee = 500;

export
const TokenIn = new Token(
  ChainId,
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  18,
  'WETH',
  'Wrapped Ether',
);

export
const ERC20_Contract = (token: Token) => new ethers.Contract(token.address, ERC20_ABI.abi, Wallet);

export
const TokenInContract = ERC20_Contract(TokenIn);

export
const TokenOut = new Token(
  ChainId,
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  18,
  'UNI',
  'Uniswap',
);

export
const TokenOutContract = ERC20_Contract(TokenOut);

export
const PoolContract = new ethers.Contract(
  computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: TokenIn,
    tokenB: TokenOut,
    fee: PoolFee,
  }),
  IUniswapV3PoolABI.abi,
  Provider,
);

export
const GetPool = async () => {
  const [liquidity, slot0] = await Promise.all([
    PoolContract.liquidity(),
    PoolContract.slot0(),
  ]);
  return new Pool(
    TokenIn,
    TokenOut,
    PoolFee,
    slot0[0].toString(),
    liquidity.toString(),
    Number(slot0[1]),
  );
};

export
const GetRoute = async () => {
  const pool = await GetPool();
  return new Route(
    [pool],
    TokenIn,
    TokenOut,
  );
};

async function getOutputQuote(route: Route<Currency, Currency>) {
  const provider = Provider;
  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      TokenIn,
      ethers.parseUnits('1', TokenIn.decimals).toString(),
    ),
    0,
    {
      useQuoterV2: true,
    },
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  return new ethers.AbiCoder().decode(['uint256'], quoteCallReturnData);
}

export async function getTokenTransferApproval(token: Token) {
  const tokenContract = ERC20_Contract(token);
  const transaction = await tokenContract.approve.populateTransaction(
    SWAP_ROUTER_ADDRESS,
    ethers.parseUnits('10', token.decimals).toString(),
  );
  return await Wallet.sendTransaction({
    ...transaction,
    from: Wallet.address,
  });
}

async function main() {
  // console.log(1);
  // const a = await Provider.getBlock('latest');
  // console.log(2);
  // return;
  const route = await GetRoute();
  // console.log(route);
  const amountOut = await getOutputQuote(route);
  console.log(amountOut);
  console.log(ethers.formatUnits(amountOut.toString(), TokenOut.decimals));

  const uncheckedTrade = Trade.createUncheckedTrade({
    route,
    inputAmount: CurrencyAmount.fromRawAmount(
      TokenIn,
      ethers.parseUnits('1', TokenIn.decimals).toString(),
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      TokenOut,
      amountOut.toString(),
    ),
    tradeType: 0,
  });

  console.log(uncheckedTrade);

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: Wallet.address,
  };

  const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: Wallet.address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };
  
  console.log('??????Swap??????...');
  const res = await Wallet.sendTransaction(tx);
  console.log(res);
  const r = await res.wait();
  console.log('??????');
  // const a = await getTokenTransferApproval(TokenIn);
  // console.log(a);
}

main();
