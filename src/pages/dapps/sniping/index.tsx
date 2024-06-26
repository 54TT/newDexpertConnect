import './index.less';
import { Input, InputNumber, Segmented, Select, Slider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useContext } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
import { getERC20Contract } from '@utils/contracts';
import Load from '@/components/allLoad/load';
export default function index() {
  const { t } = useTranslation();
  const { browser, provider }: any = useContext(CountContext);
  const [maximumSlipValue, setMaximumSlipValue] = useState(0);
  const [gasPriceValue, setGasPriceValue] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [token, setToken] = useState<any>(null);
  const [isToken, setIsToken] = useState(false);
  const [params, setParams] = useState<any>({
    MaximumSlip: 'Auto',
    GasPrice: 'Auto',
    TradeDeadlineValue: 30,
    TradeDeadlineType: 'Min',
    OrderDeadlineValue: 30,
    OrderDeadlineType: 'Min',
  });
  const searchChange = async (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value.length !== 42) {
      setToken(null);
    }
  };
  const onChange = (e: number) => {
    setMaximumSlipValue(e);
  };
  const implement = async () => {
    const tokenContract = await getERC20Contract(provider, searchValue);
    if (tokenContract?.name && tokenContract?.symbol) {
      const searchToken = {
        ...tokenContract,
        contractAddress: searchValue,
      };
      setToken(searchToken);
      setIsToken(false);
    } else {
      setIsToken(false);
    }
  };
  const enter = async (e: any) => {
    if (searchValue?.length === 42 && e.key === 'Enter') {
      setIsToken(true);
      implement();
    }
  };
  const clickSear = () => {
    if (searchValue?.length === 42) {
      setIsToken(true);
      implement();
    }
  };
  return (
    <div className="sniping" style={{ width: browser ? '45%' : '95%' }}>
      <Input
        size="large"
        rootClassName="snipingInput"
        onKeyDown={enter}
        placeholder="Contract address"
        allowClear
        onChange={searchChange}
        suffix={
          <SearchOutlined
            onClick={clickSear}
            style={{
              color: 'rgb(134,240,151)',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          />
        }
      />
      <div className="token">
        <p className="Information">{t('Slider.Token')}</p>
        <div className="selectTo">
          <span>{token?.name}</span>
          <span>{token?.symbol}</span>
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
        </div>
        <InputNumber
          rootClassName="timeInputNumber"
          min={0}
          suffix={<p style={{ color: 'rgb(134,240,151)' }}>%</p>}
          stringMode={false}
          controls={false}
          max={100}
          value={typeof maximumSlipValue === 'number' ? maximumSlipValue : 0}
          onChange={onChange}
        />
        <div className="amount">
          <p>3816.39 USDT</p>
          <p>Balance: 0</p>
        </div>
      </div>

      <div className="operate">
        <p className="amount"> {t('Slider.Sniper')}</p>
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
              defaultValue="Min"
              onChange={(e: string) => {
                const at = { ...params, TradeDeadlineType: e };
                setParams({ ...at });
              }}
              options={[
                { value: 'Min', label: t('Slider.Min') },
                { value: 'Hour', label: t('Slider.Hour') },
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
              defaultValue="Min"
              onChange={(e: string) => {
                const at = { ...params, OrderDeadlineType: e };
                setParams({ ...at });
              }}
              options={[
                { value: 'Min', label: t('Slider.Min') },
                { value: 'Hour', label: t('Slider.Hour') },
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
          <div className="gasPrice">
            <InputNumber
              rootClassName="timeInputNumber"
              min={0}
              suffix={<p style={{ color: 'rgb(134,240,151)' }}>Gas</p>}
              stringMode={false}
              controls={false}
              value={typeof gasPriceValue === 'number' ? gasPriceValue : 0}
              onChange={(e: number) => {
                setGasPriceValue(e);
              }}
            />
          </div>
        )}
        <div className="back"></div>
        <div className="backRight"></div>
      </div>

      <div className="confirm">{t('Slider.Confirm')}</div>
    </div>
  );
}
