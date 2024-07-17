import { useEffect, useState, useContext } from 'react';
import './index.less';
import cookie from 'js-cookie';
import { BigNumber, ethers } from 'ethers';
import { CountContext } from '@/Layout';
// import { createOrder,  } from "@/../utils/limit/order"
import Request from '@/components/axios.tsx';
export default function index() {
  const { loginPrivider } = useContext(CountContext);
  const { getAll } = Request();
  const [nonce, setNonce] = useState('');

  const getNoce = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/limit/getNonce',
      data: {},
      token,
    });
    if (res?.status === 200) {
      setNonce(res?.data?.nonce);
    }
  };

  const setOrder = async () => {
    console.log(11111111)
    const deadlineSeconds = 24 * 60 * 60;
    const chainId = 11155111;
    const receipt: string = '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89';
    const inputToken: string = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
    const outputToken: string = '0xb72bc8971d5e595776592e8290be6f31937097c6';
    const web3Provider = new ethers.providers.Web3Provider(loginPrivider);
    const orderCreator:any = await web3Provider.getSigner();
    const orderAmout: BigNumber = BigNumber.from(1000000);
    // chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds
    // const createResponse = await createOrder(chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds)
    // console.log("createResponse:",createResponse)
    // const token = cookie.get('token');
    // const res = await getAll({
    //   method: 'get',
    //   url: '/api/v1/limit/createOrder',
    //   data: {},
    //   token,
    // });
    // console.log(res)
  };

  useEffect(() => {
    getNoce();
  }, []);

  return (
    <div className="limitBox">
      <div
        className="top"
        onClick={() => {
          if (nonce) {
            setOrder();
          }
        }}
      >
        ppppppp
      </div>
      <div className="bot"></div>
    </div>
  );
}
