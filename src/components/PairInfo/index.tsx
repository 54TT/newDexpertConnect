import './index.less';

type PairInfoTokenType = {
  logo: string;
  symbol: string;
}

export type PairInfoPropsType = Record<'token0' | 'token1', PairInfoTokenType >
function PairInfo({ data, showArrow = false, }: { data: PairInfoPropsType, showArrow?: boolean  }) {
  const { token0, token1 } = data;
  return <div className={`pair-info-comp`}>
    <div className="pair-info-comp-img">
      <img src={token0.logo || '/default-edit-icon.png'} alt="" />
      <img src={token1.logo} alt="" />
    </div>
    <div className='token-pair-symbol'>
    <span>{token0.symbol}</span>/<span>{token1.symbol}</span>
    </div>
    {/* <div className='pair-info-body'>
      <div className='pair-info-body-title'>Liquidity Pool Reserves</div>
      <div className='pair-info-body-token'>
        <span>{token0.symbol}</span>
        <span>{token0Reserve}</span>
      </div>
      <div className='pair-info-body-token'>
        <span>{token1.symbol}</span>
        <span>WETH</span>
        <span>{token1Reserve}</span>
      </div>
    </div> */}
    {
      showArrow ? <div className='arrow-right-button'>
      <img  src="/arrow-right-black.svg" alt="" />
    </div> : <></>
    }
  </div>
  // </div>
  // )
}

export default PairInfo