import { swapChain } from '@utils/judgeStablecoin';
import { useContext } from 'react';
import { ChooseChainValueType } from './components/chooseChain';
// const ChooseChain = React.lazy(() => import('./components/chooseChain'));
import ChooseChain from './components/chooseChain';
import { CountContext } from '@/Layout';
import { config } from '@/config/config';
export interface ChangeChainPropsType {
  wrapClassName?: string; // 弹窗的classname
  hideChain?: boolean; // 隐藏有hide属性的链
  disabledChain?: boolean; // 不可选有disable属性的链
  disabled?: boolean; // 不允许编辑链
}
function ChangeChain({
  wrapClassName,
  hideChain = true,
  disabledChain = true,
  disabled = false,
}: ChangeChainPropsType) {
  const { setChainId, isLogin, loginProvider, chainId } =
    useContext(CountContext);

  async function addChain(chainId, chainData) {
    try {
      await loginProvider.request({
        method: 'wallet_addEthereumChain',
        params: [chainData],
      });
      console.log('Chain added:', chainId);
    } catch (error) {
      console.error('Error adding chain:', error);
    }
  }
  const changeWalletChain = async (v: ChooseChainValueType) => {
    const evmChainIdHex = v.key;
    const evmChainId = v.chainId;
    if (!isLogin) {
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
        setChainId(evmChainId);
      } catch (e) {
        if (e.code === 4902) {
          console.error('Switch chain not supported');
          const { name, chainId, rpcUrl, tokenSymbol, decimals, scan } =
            config[evmChainId];
          const chainData = {
            chainId: evmChainIdHex,
            chainName: name,
            blockExplorerUrls: [scan.replace('tx', '')],
            nativeCurrency: {
              name: tokenSymbol,
              symbol: tokenSymbol,
              decimals,
            },
            rpcUrls: [rpcUrl],
          };
          // 尝试添加链
          addChain(chainId, chainData);
        } else {
          console.error('Error switching chain:', e);
        }
      }
    }
  };
  return (
    <ChooseChain
      disabledChain={disabledChain}
      data={swapChain.find((i: any) => i.chainId === chainId)}
      chainList={swapChain}
      onClick={(v) => changeWalletChain(v)}
      hideChain={hideChain}
      wrapClassName={wrapClassName}
      disabled={disabled}
    />
  );
}

export default ChangeChain;
