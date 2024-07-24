import { useContext } from 'react';
import { CountContext } from '@/Layout.tsx';
import SwapComp from '@/pages/dapps/swap/components/SwapComp';
function Right({ par }: any) {
  const { browser }: any = useContext(CountContext);
  return (
    <div
      className={'right'}
      style={{
        width: browser ? '26%' : '100%',
        minWidth: '350px',
        marginTop: '15px',
      }}
    >
      <div className="box">
        <SwapComp
          initToken={[{symbol:par?.token1?.symbol,name:par?.token1?.name,contractAddress:par?.token1?.id,decimals:par?.token1?.decimals},{symbol:par?.token0?.symbol,name:par?.token0?.name,contractAddress:par?.token0?.id,decimals:par?.token0?.decimals},]}
          changeAble={false}
          initChainId={'Ethereum'}
        />
      </div>
    </div>
  );
}

export default Right;
