import { useEffect, useState } from 'react';
import './index.less';
import cookie from 'js-cookie';
// import { createOrder, executeOrder } from "@/../utils/limit/order"
import Request from '@/components/axios.tsx';
export default function index() {
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
// aaadsada

  const setOrder = async () => {
    // chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds
    // const createResponse = await createOrder()
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
