import './index.less';
import { useContext,useEffect,useState } from 'react';
import { CountContext } from '@/Layout';
import { ethers } from 'ethers';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
type PairInfoTokenType = {
  logo: string;
  symbol: string;
}

export type PairInfoPropsType = Record<'token0' | 'token1', PairInfoTokenType >
function PairInfo({ data,contractAddress }: { data: PairInfoPropsType,contractAddress:string}) {
  const { token0, token1 } = data;
  const [token0Reserve,setToken0Reserve]=useState<string>('')
  const [token1Reserve,setToken1Reserve]=useState<string>('')
  const { signer } =
    useContext(CountContext);

  console.log(data)
  console.log(contractAddress);
  const getPairInfo = async () => {
    const contract=new ethers.Contract(contractAddress, UniswapV2PairAbi, signer);
    const reserves = await contract.getReserves();
    console.log(reserves._reserve0.toString());
    console.log(reserves._reserve1);
    setToken0Reserve(ethers.utils.formatEther(reserves._reserve0))
    setToken1Reserve(ethers.utils.formatEther(reserves._reserve1))
  }
  useEffect(()=>{
    getPairInfo()
  },[])
  return (
    <div className='pair-info-wrapper'>
  <div className="pair-info-comp">
    <div className='pair-info-comp-header'>
      <div className="pair-info-comp-img">
        {token0.logo?(
          <img src={token0.logo} alt="" />
        ):(
          <span className="pairSymbol">{token0.symbol.slice(0,1)}</span>
        )
        }
        <img src={token1.logo} alt="" />
      </div>
      <div className="pair-info-comp-pair_name">
        <span>
        {`${token0.symbol}/${token1.symbol}`}
        </span>
      </div>
    </div>
    <div className='pair-info-body'>
      <div className='pair-info-body-title'>Liquidity Pool Reserves</div>
      <div className='pair-info-body-token'>
        <span>{token0.symbol}</span>
        <span>{token0Reserve}</span>
      </div>
      <div className='pair-info-body-token'>
        {/* <span>{token1.symbol}</span> */}
        <span>WETH</span>
        <span>{token1Reserve}</span>
      </div>
    </div>
  </div>
  </div>
  )
}

export default PairInfo