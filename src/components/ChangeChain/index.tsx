import { swapChain } from '@utils/judgeStablecoin';
import { useContext } from 'react';
import { ChooseChainValueType } from './components/chooseChain';
// const ChooseChain = React.lazy(() => import('./components/chooseChain'));
import ChooseChain from './components/chooseChain'
import { CountContext } from '@/Layout';
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
        console.error(e);
        return null;
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
