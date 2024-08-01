import { BigNumber } from 'ethers';
import { zeroAddress } from './constants';
import { getERC20Contract } from './contracts';
import Decimal from 'decimal.js';
const getBalanceRpcEther = async (
  injectProvider,
  token,
  weth
): Promise<Decimal> => {
  // 需要用钱包对象查
  const signer = await injectProvider.getSigner();
  let decimals = 18;
  if (!token) return;
  if (token === zeroAddress) {
    const balance: BigNumber = await signer.getBalance();
    return new Decimal(balance.toString()).div(new Decimal(10).pow(18));
  }

  const erc20Contract: any = await getERC20Contract(injectProvider, token);
  if (
    token.toLocaleLowerCase() !== zeroAddress.toLocaleLowerCase() &&
    token.toLocaleLowerCase() !== weth.toLocaleLowerCase()
  ) {
    decimals = await erc20Contract.decimals();
  }
  let address;
  try {
    address = await signer.getAddress();
  } catch (e) {
    return null;
  }

  const balance: BigNumber = await erc20Contract?.balanceOf(address);
  if (balance.isZero()) return new Decimal(balance.toString());
  return new Decimal(balance.toString()).div(new Decimal(10).pow(decimals));
};
export default getBalanceRpcEther;
