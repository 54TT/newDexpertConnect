import { BigNumber, ethers } from 'ethers';
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
    return new Decimal(ethers.utils.formatEther(await signer.getBalance()));
  }
  const erc20Contract = await getERC20Contract(injectProvider, token);
  if (
    token.toLocaleLowerCase() !== zeroAddress.toLocaleLowerCase() &&
    token.toLocaleLowerCase() !== weth.toLocaleLowerCase()
  ) {
    decimals = await erc20Contract.decimals();
  }

  console.log(signer);

  const address = await signer.getAddress();

  const balance: BigNumber = await erc20Contract.balanceOf(address);

  return new Decimal(balance.div(BigNumber.from(10 ** decimals)).toString());
};
export default getBalanceRpcEther;
