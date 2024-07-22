import { useNavigate } from 'react-router-dom';
import './index.less';
import ChooseChain from '@/components/chooseChain';
import { swapChain } from '@utils/judgeStablecoin';
import { useContext } from 'react';
import { CountContext } from '@/Layout';
import {
  CHAIN_NAME_TO_CHAIN_ID,
  CHAIN_NAME_TO_CHAIN_ID_HEX,
} from '@utils/constants';
function LaunchHome() {
  const { loginProvider, chainId, setChainId, isLogin } =
    useContext(CountContext);
  const history = useNavigate();

  const changeWalletChain = async (v: string) => {
    const evmChainIdHex = CHAIN_NAME_TO_CHAIN_ID_HEX[v];
    const evmChainId = CHAIN_NAME_TO_CHAIN_ID[v];
    if (!isLogin) {
      setChainId(evmChainId);
    } else {
      // 有evm钱包环境
      try {
        //@ts-ignore
        await loginProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: evmChainIdHex,
            },
          ],
        });
      } catch (e) {
        return null;
      }
    }
  };

  return (
    <>
      <div className="launch-home">
        <div className="launch-home-top">
          <div className="animate-wave">
            <div className="w1"></div>
            <div className="w2"></div>
            <div className="w3"></div>
            <div className="w4"></div>
            <div className="w5"></div>
            <div className="w6"></div>
          </div>

          <div className="launch-home-top-icon">
            <img src="/launchTop.svg" alt="" />
          </div>
          <div
            className="launch-home-button"
            onClick={() => history('/dapps/mint/form')}
          >
            Launch
          </div>
          <ChooseChain
            disabledChain={true}
            data={swapChain.find((i: any) => i.chainId === chainId)}
            chainList={swapChain}
            onClick={(v) => changeWalletChain(v)}
            hideChain={true}
          />
        </div>
        <div className="launch-home-bottom">
          <img className="cloud-left cloud" src="/cloudLeft.svg" alt="" />
          <img className="rocket" src="/rocket.svg" alt="" />
          <img className="cloud-right cloud" src="/cloudRight.svg" alt="" />
        </div>
      </div>
      <div className="launch-home-manage_token">
        <span
          onClick={() => {
            history('/dapps/mint/manageToken');
          }}
        >
          代币管理
        </span>
      </div>
    </>
  );
}

export default LaunchHome;
