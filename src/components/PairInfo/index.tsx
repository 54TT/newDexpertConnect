import './index.less';
type PairInfoTokenType = {
  logo: string;
  symbol: string;
}

export type PairInfoPropsType = Record<'token0' | 'token1', PairInfoTokenType >
function PairInfo({ data }: { data: PairInfoPropsType }) {
  const { token0, token1 } = data;
  return <div className="pair-info-comp">
    <div className="pair-info-comp-img">
      <img src={token0.logo} alt="" />
      <img src={token1.logo} alt="" />
    </div>
    <div className="pair-info-comp-pair_name">
      <span>
      {`${token0.symbol}/${token1.symbol}`}
      </span>
    </div>
  </div>
}

export default PairInfo