import {
  InputNumber,
  Segmented,
  Select,
  Slider,
  Skeleton,
  Collapse,
} from 'antd';
import { useState, useContext } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
import { getERC20Contract } from '@utils/contracts';
import Load from '@/components/allLoad/load';
import NotificationChange from '@/components/message';
import UsePass from '@/components/UsePass';
import Decimal from 'decimal.js';
import _ from 'lodash';
import InputSearch from './inputSearch';
import SelectTokenModal from '@/components/SelectTokenModal';
import { getUniswapV2RouterContract } from '@utils/contracts';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
export default function fillData({
  setGasPrice,
  token,
  setToken,
  params,
  setParams,
  value,
  setValue,
  setUseToken,
  setMaximumSlip,
  payType,
  setPayType,
  useToken,
  provider,
  contractConfig,
  chainId,
}: any) {
  const { t } = useTranslation();
  const { loginProvider, transactionFee }: any = useContext(CountContext);
  // const [payType, setPayType] = useState('0');
  const [maximumSlipValue, setMaximumSlipValue] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isToken, setIsToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [tokenInValue, setTokenInValue] = useState(0);
  // 是否显示   价值
  const [isShow, setIsShow] = useState(false);
  const searchChange = async (e: any) => {
    const yy = e.target.value.replace(/\s*/g, '');
    setSearchValue(yy);
    if (yy.length !== 42) {
      setToken(null);
    }
  };
  const onChange = (e: number) => {
    setMaximumSlipValue(e);
    setMaximumSlip(e);
  };
  const implement = async () => {
    try {
      const contract = await getERC20Contract(provider, searchValue);
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
    if( e.key === 'Enter'){
      e.preventDefault();
    }
    if (searchValue?.length === 42 && e.key === 'Enter') {
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
  const mask = { 0: '100%', 25: '125%', 50: '150%', 75: '175%', 100: '200%' };
  return (
    <div className="scrollHei sniperOrder" style={{ margin: '20px 0 10px' }}>
      <div className="Contractaddress">
        {/* 0x7b522bA8C126716bf7c9E5f92951aCae38a680d6 */}
        <InputSearch
          enter={enter}
          searchChange={searchChange}
          placeholder={t('sniping.Contract')}
        />
      </div>
      <div className="token">
        <p className="Information">{t('Slider.Token')}</p>
        <div className="selectTo">
          <p>{token?.symbol ? token?.symbol : '-----'}</p>
          <p>{token?.name ? token?.name : '----'}</p>
        </div>
        <div className="address">
          <p>{t('Slider.address')}</p>
          <p>{token?.contractAddress ? token?.contractAddress : '.....'}</p>
        </div>
        {isToken && (
          <div className="posi">
            <Load />
          </div>
        )}
      </div>
      <div className="tokenIn">
        <div className="price">
          <p>{t('sniping.Snipers')}</p>
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
        </div>
        <div className="amount">
          <div>
            {!isShow ? (
              tokenInValue + ' ' + contractConfig?.defaultTokenOut?.symbol
            ) : (
              <Skeleton.Button active size="small" />
            )}
          </div>
        </div>
      </div>
      <Collapse
        collapsible="icon"
        className="sniperCollapse"
        expandIconPosition="end"
        expandIcon={(e: any) => {
          return (
            <img
              src="/collopse.svg"
              alt=""
              style={{
                transform: e?.isActive ? 'rotate(-90deg)' : 'rotate(0deg)',
              }}
            />
          );
        }}
        items={[
          {
            key: '1',
            label: <p className="amount"> {t('sniping.Sniper')}</p>,
            children: (
              <div className="operate">
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
                        typeof maximumSlipValue === 'number'
                          ? maximumSlipValue
                          : 0
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
                        typeof maximumSlipValue === 'number'
                          ? maximumSlipValue
                          : 0
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
                )}
                <div className="service-fee">
                  <span>{t('sniping.Service')}</span>
                  <UsePass
                    type="swap"
                    payType={payType}
                    onChange={(v: string) => {
                      setPayType(v);
                    }}
                    status="0.5%"
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
      <SelectTokenModal
        open={open}
        disabledTokens={[useToken?.contractAddress?.toLowerCase?.()]}
        chainId={chainId}
        onChange={(data) => {
          if (loginProvider) {
            if (value) {
              getAmount(value, data);
              setIsShow(true);
            }
          }
          setUseToken(data);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
