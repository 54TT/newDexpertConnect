import {
  Input,
  InputNumber,
  Segmented,
  Select,
  Slider,
  Skeleton,
  Collapse,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useContext, useEffect } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
import { getERC20Contract } from '@utils/contracts';
import Load from '@/components/allLoad/load';
import NotificationChange from '@/components/message';
import Decimal from 'decimal.js';
import _ from 'lodash';
import SelectTokenModal from '@/components/SelectTokenModal';
import { ethers } from 'ethers';
import { getUniswapV2RouterContract } from '@utils/contracts';
import {
  CHAIN_NAME_TO_CHAIN_ID_HEX,
  CHAIN_VERSION_TO_CHAIN_ID,
} from '@utils/constants';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
import ChooseChain from '@/components/chooseChain';
import { swapChain } from '@utils/judgeStablecoin';
import { config } from '@/config/config.ts';
export default function fillData({
  setIsChain,
  setGasPrice,
  token,
  setToken,
  params,
  setParams,
  value,
  setValue,
  setId,
  setUseToken,setMaximumSlip
}: any) {
  const { t } = useTranslation();
  const { loginPrivider, transactionFee, isLogin, user }: any =
    useContext(CountContext);
  const [maximumSlipValue, setMaximumSlipValue] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isToken, setIsToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [tokenInValue, setTokenInValue] = useState(0);
  // 是否显示   价值
  const [isShow, setIsShow] = useState(false);
  const [chainId, setChainId] = useState('1');
  const [chain, setChain] = useState<any>();
  const [contractConfig, setContractConfig] = useState<any>();
  // 当前链的
  const [provider, setProvider] = useState<any>();
  // 选择链改变   privider
  const changePrivider = (chainId: string, choose?: string) => {
    const newConfig = config[chainId ?? '1'];
    setContractConfig(newConfig);
    setUserToken(newConfig?.defaultTokenIn);
    setUseToken(newConfig?.defaultTokenIn);
    const rpcProvider = new ethers.providers.JsonRpcProvider(newConfig.rpcUrl);
    if (choose === 'choose') {
      if (searchValue?.length === 42) {
        setIsToken(true);
        implement(rpcProvider);
      }
    }
    setProvider(rpcProvider);
  };

  useEffect(() => {
    if (!user?.uid) {
      setIsChain('error');
    }
  }, []);
  useEffect(() => {
    if (loginPrivider && isLogin) {
      changeChain();
    }
    changePrivider(chainId);
    return () => {
      // @ts-ignore
      (loginPrivider as any)?.removeListener?.('chainChanged', onChainChange);
    };
  }, [chainId, loginPrivider, isLogin]);
  //  使用的token
  const [useToken, setUserToken] = useState<any>();
  const searchChange = async (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value.length !== 42) {
      setToken(null);
    }
  };
  const onChange = (e: number) => {
    setMaximumSlipValue(e);
    setMaximumSlip(e);
  };
  const implement = async (moreProvider?: any) => {
    try {
      const contract = await getERC20Contract(
        moreProvider ? moreProvider : provider,
        searchValue
      );
      const getSymbolAsync = contract.symbol();
      const getNameAsync = contract.name();
      const getDecimalsAsync = contract.decimals();
      const [symbol, name, decimals] = await Promise.all([
        getSymbolAsync,
        getNameAsync,
        getDecimalsAsync,
      ]);
      const searchToken = {
        symbol,
        name,
        decimals,
        contractAddress: searchValue,
      };
      console.log(searchToken);
      setToken(searchToken);
      setIsToken(false);
    } catch (e) {
      setIsToken(false);
      setToken(null);
      NotificationChange('error', t('Slider.chain'));
      return null;
    }
  };
  const enter = async (e: any) => {
    if (searchValue?.length === 42 && e.key === 'Enter') {
      setIsToken(true);
      implement();
    }
  };
  const clickSearch = () => {
    if (searchValue?.length === 42) {
      setIsToken(true);
      implement();
    }
  };
  //  获取输出  价格
  const getAmount = async (value: number, token?: any, moreProvider?: any) => {
    const { uniswapV2RouterAddress, defaultTokenOut } = contractConfig;
    const param = [
      chainId,
      moreProvider ? moreProvider : provider,
      await getUniswapV2RouterContract(
        moreProvider ? moreProvider : provider,
        uniswapV2RouterAddress
      ),
      [
        token?.contractAddress
          ? token?.contractAddress
          : useToken.contractAddress,
        Number(token?.decimals ? token.decimals : useToken.decimals),
      ],
      [defaultTokenOut?.contractAddress, Number(defaultTokenOut?.decimals)],
      new Decimal(value),
      new Decimal(0),
      transactionFee.swap,
    ].filter((item) => item !== null);
    try {
      let amount;
      amount = await getAmountOut.apply(null, param);
      setIsShow(false);
      setTokenInValue(Number(amount.toString()) || 0);
      // setAmountOut(Number(amount.toString()));
    } catch (e) {
      setIsShow(false);
      return null;
    }
  };
  const onChangeGas = (e: number) => {
    setGasPrice(e);
  };
  const change = _.debounce((e: number) => {
    getAmount(e);
    setIsShow(true);
  }, 1000);
  //  判断是否支持的链
  const supportedChain = (chain: string) => {
    if (chain === '0x1' || chain === '0x2105' || chain === '0xaa36a7') {
      const chainID = CHAIN_VERSION_TO_CHAIN_ID[chain];
      setChainId(chainID);
      setId(chainID);
      const data = swapChain.filter((i: any) => i.key === chain);
      setChain(data[0]);
      setIsChain('success');
    } else {
      NotificationChange('warning', t('Slider.c'));
      setIsChain('error');
    }
  };
  // 监听切换链
  const onChainChange = (targetChainId) => {
    supportedChain(targetChainId);
  };
  //  是否切换链
  const changeChain = async () => {
    const chain = await loginPrivider.send('eth_chainId', []);
    if (chain?.result === '0x1') {
      setIsChain('success');
    } else {
      try {
        loginPrivider?.on('chainChanged', onChainChange);
        await loginPrivider?.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${Number(chainId).toString(16)}`,
            },
          ],
        });
      } catch (e) {
        supportedChain(chain?.result);
        return null;
      }
    }
  };
  const changeWalletChain = async (v: any) => {
    const evmChainIdHex = CHAIN_NAME_TO_CHAIN_ID_HEX[v.value];
    if (loginPrivider) {
      // 有evm钱包环境
      try {
        //@ts-ignore
        await loginPrivider.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: evmChainIdHex,
            },
          ],
        });
        setChainId(v.chainId);
        setId(v.chainId);
        setChain(v);
      } catch (e) {
        return null;
      }
    }
    // if (evmChainId !== chainId) {
    //   changePrivider(evmChainId, 'choose');
    //   setChainId(evmChainId);
    // }
  };
  const mask = { 0: '100%', 25: '125%', 50: '150%', 75: '175%', 100: '200%' };
  return (
    <div className="scrollHei sniperOrder" style={{ margin: '20px 0 10px' }}>
      <div className="Contractaddress">
        {/* 0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85 */}
        <Input
          size="large"
          rootClassName="snipingInput"
          onKeyDown={enter}
          placeholder="Contract address"
          allowClear
          onChange={searchChange}
          suffix={
            <SearchOutlined
              onClick={clickSearch}
              style={{
                color: 'rgb(134,240,151)',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            />
          }
        />
        <ChooseChain
          disabledChain={true}
          data={chain}
          chainList={swapChain}
          onClick={(v) => changeWalletChain(v)}
          hideChain={true}
          wrapClassName="swap-chooose-chain"
        />
      </div>
      <div className="token">
        <p className="Information">{t('Slider.Token')}</p>
        <div className="selectTo">
          <p>{token?.symbol}</p>
          <p>{token?.name}</p>
        </div>
        <div className="address">
          <p>{t('Slider.address')}</p>
          <p>{token?.contractAddress}</p>
        </div>
        {/* <div className="Total">
          <span> {t('Slider.Total')}</span>
          <span>{thousands('777773434000000')}</span>
        </div> */}
        <div className="back"></div>
        <div className="backRight"></div>
        {isToken && (
          <div className="posi">
            <Load />
          </div>
        )}
      </div>
      <div className="tokenIn">
        <div className="price">
          <p>Sniper Amount</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* v2  v3 */}
            {/* <QuotoPathSelect
              data={quotePath}
              onChange={(key: string) => {
                setQuotePath(key);
                if (loginPrivider) {
                  setIsShow(true);
                  getAmount(value, key);
                }
              }}
            /> */}
            {/* 选择token onClick={() => setOpen(true)}*/}
            <div className="eth">
              <img src={useToken?.logoUrl} alt="" />
              <span>{useToken?.symbol}</span>
              <img src="/tokenLogo.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="balan">
          {/* 数量 */}
          <InputNumber
            rootClassName="tokenValue"
            min={0}
            defaultValue={0}
            stringMode={false}
            controls={false}
            value={value}
            onChange={(e: number) => {
              if (e) {
                change(e);
              }
              setValue(e);
            }}
          />
          {/* <p
            onClick={() => {
              if (Number(balance)) {
                getAmount(balance, quotePath);
                setIsShow(true);
                setValue(balance);
              }
            }}
          >
            {t('Slider.max')}
          </p> */}
        </div>
        <div className="amount">
          <div>
            {!isShow ? (
              tokenInValue + ' ' + contractConfig?.defaultTokenOut?.symbol
            ) : (
              <Skeleton.Button active size="small" />
            )}
          </div>
          {/* <div>
            Balance: 
            {isBalance ? <Skeleton.Button active size="small" /> : balance}
          </div> */}
        </div>
      </div>

      <div className="operate">
        <p className="amount"> Advanced settings</p>
        <div className="row">
          <p> {t('Slider.Maximum')}</p>
          <div className="time">
            <Segmented
              rootClassName="timeSegmented"
              options={[
                { label: t('Slider.Auto'), value: 'Auto' },
                { label: t('Slider.Customize'), value: 'Customize' },
              ]}
              onChange={(value) => {
                const at = { ...params, MaximumSlip: value };
                setParams({ ...at });
              }}
            />
          </div>
        </div>
        {params?.MaximumSlip === 'Customize' && (
          <div className="sidle">
            <Slider
              rootClassName="sidleSlider"
              min={0}
              max={100}
              styles={{
                rail: {
                  background: 'rgb(72,72,72)',
                },
                track: {
                  background: 'rgb(134,240,151)',
                },
                handle: {
                  borderRadius: '5px',
                  width: '8px',
                  height: '15px',
                  marginTop: '-3px',
                  background: 'white',
                },
              }}
              onChange={onChange}
              value={
                typeof maximumSlipValue === 'number' ? maximumSlipValue : 0
              }
            />
            <InputNumber
              rootClassName="timeInputNumber"
              min={0}
              suffix={<p style={{ color: 'rgb(134,240,151)' }}>%</p>}
              stringMode={false}
              controls={false}
              max={100}
              value={
                typeof maximumSlipValue === 'number' ? maximumSlipValue : 0
              }
              onChange={onChange}
            />
          </div>
        )}
        <div style={{ margin: ' 7px 0' }} className="row">
          <p> {t('Slider.Trade')}</p>
          <div className="time">
            <InputNumber
              min={0}
              defaultValue={30}
              stringMode={false}
              controls={false}
              rootClassName="timeInputNumber"
              onChange={(e: number) => {
                const at = { ...params, TradeDeadlineValue: e };
                setParams({ ...at });
              }}
            />
            <Select
              rootClassName="timeSelect"
              defaultValue="1"
              onChange={(e: string) => {
                const at = { ...params, TradeDeadlineType: e };
                setParams({ ...at });
              }}
              options={[
                { value: '1', label: t('Slider.Min') },
                { value: '2', label: t('Slider.Hour') },
              ]}
            />
          </div>
        </div>
        <div className="row">
          <p> {t('Slider.Order')}</p>
          <div className="time">
            <InputNumber
              min={0}
              defaultValue={30}
              stringMode={false}
              controls={false}
              rootClassName="timeInputNumber"
              onChange={(e: number) => {
                const at = { ...params, OrderDeadlineValue: e };
                setParams({ ...at });
              }}
            />
            <Select
              rootClassName="timeSelect"
              defaultValue="1"
              onChange={(e: string) => {
                const at = { ...params, OrderDeadlineType: e };
                setParams({ ...at });
              }}
              options={[
                { value: '1', label: t('Slider.Min') },
                { value: '2', label: t('Slider.Hour') },
              ]}
            />
          </div>
        </div>
        <div style={{ marginTop: ' 7px' }} className="row">
          <p>{t('Slider.Gas')}</p>
          <div className="time">
            <Segmented
              rootClassName="timeSegmented"
              options={[
                { label: t('Slider.Auto'), value: 'Auto' },
                { label: t('Slider.Customize'), value: 'Customize' },
              ]}
              onChange={(value) => {
                const at = { ...params, GasPrice: value };
                setParams({ ...at });
              }}
            />
          </div>
        </div>
        {params?.GasPrice === 'Customize' && (
          <Slider
            marks={mask}
            step={null}
            onChange={onChangeGas}
            styles={{
              rail: {
                background: 'rgb(72,72,72)',
              },
              track: {
                background: 'rgb(134,240,151)',
              },
            }}
            rootClassName="CustomizeSlider"
          />
          // <div className="gasPrice">
          //   <InputNumber
          //     rootClassName="timeInputNumber"
          //     min={0}
          //     suffix={<p style={{ color: 'rgb(134,240,151)' }}>Gas</p>}
          //     stringMode={false}
          //     controls={false}
          //     value={typeof gasPriceValue === 'number' ? gasPriceValue : 0}
          //     onChange={(e: number) => {
          //       setGasPriceValue(e);
          //     }}
          //   />
          // </div>
        )}
        {/* <div className="service-fee">
            <span>Service Fees</span>
            <UsePass
              type="swap"
              payType={payType}
              onChange={(v: string) => {
                setPayType(v);
              }}
            />
          </div> */}
        <div className="back"></div>
        <div className="backRight"></div>
      </div>
      <SelectTokenModal
        open={open}
        disabledTokens={[useToken?.contractAddress?.toLowerCase?.()]}
        chainId={chainId}
        onChange={(data) => {
          if (loginPrivider) {
            if (value) {
              getAmount(value, data);
              setIsShow(true);
            }
          }
          setUserToken(data);
          setUseToken(data);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
