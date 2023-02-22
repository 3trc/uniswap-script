import { ethers } from 'ethers';
import QuoterABI from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

const secret = require('../.secret.json');

const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

async function main() {
  const [tokenInAddress, tokenInDecimals] = ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18];
  const [tokenOutAddress, tokenOutDecimals] = ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6];
  const provider = new ethers.JsonRpcProvider(secret.rpcUrl);
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    QuoterABI.abi,
    provider,
  );
  setInterval(async () => {
    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
      tokenInAddress,
      tokenOutAddress,
      500,
      ethers.parseUnits('1', tokenInDecimals).toString(),
      0,
    );
    console.log(ethers.formatUnits(quotedAmountOut, tokenOutDecimals));
  }, 2000);
}

main();
