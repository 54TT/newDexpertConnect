import './index.less';
import { Input, InputNumber, Segmented, Select, Slider, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useContext, useEffect } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
import { getERC20Contract } from '@utils/contracts';
import Load from '@/components/allLoad/load';
import NotificationChange from '@/components/message';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { BigNumber, ethers } from 'ethers';
import Request from '@/components/axios';
import { Permit2Abi } from '@abis/Permit2Abi';
import { getSwapEthAndWeth } from '@utils/swap/v2/getSwapEthAndWeth';
import QuotoPathSelect from '@/components/QuotoPathSelect';
import UsePass from '@/components/UsePass';
import getBalanceRpc from '@utils/getBalanceRpc';
import SelectTokenModal from '@/components/SelectTokenModal';
import { getUniswapV2RouterContract } from '@utils/contracts';
import { getV3AmountOut } from '@utils/swap/v3/getAmountOut';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
import { getSwapExactInBytes as getSwapExactInBytesV3 } from '@utils/swap/v3/getSwapExactInBytes';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
import { expandToDecimalsBN } from '@utils/utils';
import {  getPermitSignature } from '@utils/permit2';

export default function index() {
  const { t } = useTranslation();
  const {
    browser,
    provider,
    chainId,
    loginPrivider,
    contractConfig,
    transactionFee,
    user,
    setIsModalOpen,
  }: any = useContext(CountContext);
   // 如果是uniswap3 需要的数据
  const [swapV3Pool, setSwapV3Pool] = useState({
    fee: 0,
    poolAddress: '',
  });
  const { getAll } = Request();
  const [maximumSlipValue, setMaximumSlipValue] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  // sniper   token
  const [token, setToken] = useState<any>(null);
  const [isToken, setIsToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [quotePath, setQuotePath] = useState('0'); // 0 uniswapV2 1 V3
  const [tokenInValue, setTokenInValue] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isBalance, setIsBalance] = useState(true);
  const [value, setValue] = useState(0);
  //  pass  卡
  const [payType, setPayType] = useState('0');
  const [gasPrice, setGasPrice] = useState(0);
  //  使用的token
  const [useToken, setUserToken] = useState<any>(
    contractConfig?.defaultTokenIn
  );
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
      NotificationChange('error', 'please input address correctly');
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
  // 获取钱包余额
  const getBalance = async () => {
    const injectProvider = new ethers.providers.Web3Provider(
      // @ts-ignore
      window?.ethereum
    );
    const balance = await getBalanceRpc(
      injectProvider,
      useToken?.contractAddress,
      contractConfig?.wethAddress
    );
    if (balance) {
      const data = Number(balance.toString())
        .toFixed(7)
        .replace(/\.?0*$/, '');
      setBalance(Number(data) || 0);
      setIsBalance(false);
    } else {
      setBalance(0);
      setIsBalance(false);
    }
    // const amountInDecimal = new Decimal(1);
    // const tt = amountInDecimal.lessThanOrEqualTo(balance);
  };

  useEffect(() => {
    if (useToken?.contractAddress && user?.uid) {
      getBalance();
    } else {
      setIsBalance(false);
    }
  }, [useToken]);
  //  获取输出  价格
  const getAmount = async (value: number, quotePath: string, token?: any) => {
    const { uniswapV2RouterAddress, defaultTokenOut } = contractConfig;
    const param = [
      chainId,
      provider,
      quotePath === '0'
        ? await getUniswapV2RouterContract(provider, uniswapV2RouterAddress)
        : null,
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
      if (quotePath === '0') {
        amount = await getAmountOut.apply(null, param);
      } else {
        const { quoteAmount, ...poolInfo } = await getV3AmountOut.apply(
          null,
          param
        );
        amount = quoteAmount;
        console.log(poolInfo);
        setSwapV3Pool(poolInfo);
      }
      setIsShow(false);
      setTokenInValue(Number(amount.toString()) || 0);
      // setAmountOut(Number(amount.toString()));
    } catch (e) {
      setIsShow(false);
      return null;
    }
  };
  // 获取交易字节码
  const getSwapBytes = async (data: any) => {
    const { ethAddress, wethAddress } = contractConfig;
    const {
      amountIn,
      amountOut,
      tokenIn,
      tokenOut,
      permit,
      signature,
      recipientAddress,
    } = data;
    const getBytesParam = [
      chainId,
      provider,
      [tokenIn.contractAddress, tokenIn.decimals],
      [tokenOut.contractAddress, tokenOut.decimals],
      new Decimal(amountIn),
      new Decimal(amountOut),
      recipientAddress,
      payType == '0' ? 1 : 0,
      0,
      quotePath === '1' ? swapV3Pool?.fee : null,
      permit,
      signature,
    ].filter((item) => item !== null);

    const getSwapBytesFn = async (tokenIn, tokenOut) => {
      if (
        (tokenIn.contractAddress === ethAddress ||
          tokenIn.contractAddress === wethAddress) &&
        (tokenOut.contractAddress === ethAddress ||
          tokenOut.contractAddress === wethAddress)
      ) {
        return await getSwapEthAndWeth.apply(null, [
          chainId,
          [tokenIn.contractAddress, Number(tokenIn.decimals)],
          [tokenOut.contractAddress, Number(tokenOut.decimals)],
          new Decimal(amountIn),
          new Decimal(amountOut),
          recipientAddress,
          permit,
          signature,
        ]);
      }
      if (quotePath === '0') {
        return await getSwapExactInBytes.apply(null, getBytesParam);
      }
      if (quotePath === '1') {
        return await getSwapExactInBytesV3.apply(null, getBytesParam);
      }
    };
    const { commands, inputs } = await getSwapBytesFn(tokenIn, tokenOut);
    let etherValue: any = BigNumber.from(0);
    if (tokenIn.contractAddress === contractConfig.ethAddress) {
      etherValue = expandToDecimalsBN(new Decimal(amountIn), 18);
    }
    return { commands, inputs, etherValue };
  };
  // 获取签名
  const signPermit = async ({
    signerAddress,
    token,
    amount,
    permit2Contract,
    signer,
  }) => {
    const { universalRouterAddress } = contractConfig;
    const intervalTime = 0.5 * 3600;
    const dateTimeStamp =
      Number(String(Date.now()).slice(0, 10)) + intervalTime;
    const permitSingle: any = {
      sigDeadline: dateTimeStamp,
      spender: universalRouterAddress,
      details: {
        token,
        amount,
        expiration: 0,
        nonce: 0,
      },
    };
    let signatureData;
    try {
      const { eip712Domain, PERMIT2_PERMIT_TYPE, permit } =
        await getPermitSignature(
          Number(chainId),
          permitSingle,
          permit2Contract,
          signerAddress
        );

      const signature = await signer._signTypedData(
        eip712Domain,
        PERMIT2_PERMIT_TYPE,
        permit
      );
      signatureData = { permit, signature };
    } catch (e) {
      return null;
    }

    return signatureData;
  };
  const goSniping = async () => {
    // token   useToken
    // 判断输入的数量 不大于  拥有的
    if (Number(value) <= Number(balance)) {
      const { permit2Address } =
        contractConfig;
      const web3Provider = new ethers.providers.Web3Provider(loginPrivider);
      const signer = await web3Provider.getSigner();
      const signerAddress = await signer.getAddress();
      const permit2Contract = new ethers.Contract(
        permit2Address,
        Permit2Abi,
        signer
      );
      const decimals = await useToken.decimals;
      const { permit, signature } = await signPermit({
        signerAddress,
        token: useToken.contractAddress,
        amount: expandToDecimalsBN(new Decimal(value), decimals),
        permit2Contract,
        signer,
      });
      const { commands, inputs, etherValue } = await getSwapBytes({
        amountIn: value,
        amountOut: 0,
        tokenIn: useToken,
        tokenOut: token,
        permit,
        signature,
        recipientAddress: signerAddress,
      });
    }
    // const tt = await getAll({
    //   method: 'post',
    //   url: '/api/v1/sniper/preswap',
    //   data: {},
    //   token,
    //   chainId,
    // });
    // if (tt?.status === 200) {
    // }
  };

  const onChangeGas = (e: any) => {
    setGasPrice(e);
  };
  const change = _.debounce((e: number) => {
    getAmount(e, quotePath);
    setIsShow(true);
  }, 1000);
  const mask = { 0: '100%', 25: '125%', 50: '150%', 75: '175%', 100: '200%' };

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
            onClick={clickSearch}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <QuotoPathSelect
              data={quotePath}
              onChange={(key: string) => {
                setQuotePath(key);
                setIsShow(true);
                getAmount(value, key);
              }}
            />
            <div className="eth" onClick={() => setOpen(true)}>
              <img src={useToken?.logoUrl} alt="" />
              <span>{useToken?.symbol}</span>
              <img src="/tokenLogo.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="balan">
          <InputNumber
            rootClassName="tokenValue"
            min={0}
            defaultValue={0}
            stringMode={false}
            controls={false}
            value={value}
            onChange={(e: number) => {
              change(e);
              setValue(e);
            }}
          />
          <p
            onClick={() => {
              if (Number(balance)) {
                getAmount(balance ? balance : 0, quotePath);
                setIsShow(true);
                setValue(balance ? balance : 0);
              }
            }}
          >
            {t('Slider.max')}
          </p>
        </div>
        <div className="amount">
          <div>
            {!isShow ? (
              tokenInValue + ' ' + contractConfig.defaultTokenOut.symbol
            ) : (
              <Skeleton.Button active size="small" />
            )}
          </div>
          <div>
            Balance: 
            {isBalance ? <Skeleton.Button active size="small" /> : balance}
          </div>
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
        <div className="service-fee">
          <span>Service Fees</span>
          <UsePass
            type="swap"
            payType={payType}
            onChange={(v: string) => {
              setPayType(v);
            }}
          />
        </div>
        <div className="back"></div>
        <div className="backRight"></div>
      </div>
      <div
        className="confirm"
        onClick={() => {
          if (user?.uid) {
            goSniping();
          } else {
            setIsModalOpen(true);
          }
        }}
      >
        {user?.uid ? t('Slider.Confirm') : t('Common.Connect Wallet')}
      </div>
      <SelectTokenModal
        open={open}
        disabledTokens={[useToken?.contractAddress?.toLowerCase?.()]}
        chainId={chainId}
        onChange={(data) => {
          setUserToken(data);
          getAmount(value, quotePath, data);
          setIsShow(true);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
