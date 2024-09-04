import { CountContext } from '@/Layout';
import { FormDataType } from '@/pages/dapps/mint/pages/LaunchFill';
import { tokenFactoryERC20Abi } from '@abis/tokenFactoryERC20Abi';
import { toEthWithDecimal } from '@utils/convertEthUnit';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
export function useTokenInfo(address: string): [Partial<FormDataType>, ethers.Contract] {
  const [tokenInfo, setTokenInfo] = useState<Partial<FormDataType>>();
  const [tokenContract, setTokenContract] = useState<ethers.Contract>();
  const { signer } = useContext(CountContext);

  const getTokenInfo = async () => {
    const tokenContract = new ethers.Contract(
      address,
      tokenFactoryERC20Abi,
      signer
    );
    const {
      description,
      logoLink,
      twitterLink,
      telegramLink,
      discordLink,
      websiteLink,
    } = await tokenContract.tokenInfo();
    const name = await tokenContract.name();
    const totalSupply = await tokenContract.totalSupply();
    const symbol = await tokenContract.symbol();
    const owner = await tokenContract.owner();
    const pair = await tokenContract.pair();
    const decimals = await tokenContract.decimals();
    const isOpenTrade = await tokenContract.tradingOpen();

    const tokenItemDataFormat = {
      description,
      logoLink,
      twitterLink,
      telegramLink,
      discordLink,
      websiteLink,
      address,
      name,
      symbol,
      decimals,
      owner,
      pair,
      isOpenTrade,
      totalSupply: toEthWithDecimal(totalSupply, decimals),
    };
    setTokenContract(tokenContract)
    setTokenInfo(tokenItemDataFormat);
  }

  useEffect(() => {
    if (address && signer) {
      getTokenInfo();
    }
  }, [address, signer])

  return [tokenInfo, tokenContract]

}