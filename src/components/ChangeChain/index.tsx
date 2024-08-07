import { swapChain } from '@utils/judgeStablecoin';
import ChooseChain, { ChooseChainValueType } from '../chooseChain';
import { useContext } from 'react';
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
