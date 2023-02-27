import { ethers } from 'ethers';

const secret = require('../../.secret.json');

export
const Provider = new ethers.JsonRpcProvider(secret.rpcUrl);

export
const Wallet = new ethers.Wallet(secret.privateKey, Provider);
