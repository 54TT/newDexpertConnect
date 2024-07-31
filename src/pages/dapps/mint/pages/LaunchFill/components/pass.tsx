import { useEffect, useState, useContext } from 'react';
import cookie from 'js-cookie';
import dayjs from 'dayjs';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Loading from '@/components/allLoad/loading';
import { MintContext } from '../../../index';
export default function pass() {
  const { getAll } = Request();
  const { browser }: any = useContext(CountContext);
  const { launchTokenPass, setLaunchTokenPass }: any = useContext(MintContext);
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const getPass = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/d_pass/info',
      data: {},
      token,
    });
    if (res?.status === 200) {
      setParams(res?.data);
      setLoading(true);
    } else {
      setLoading(true);
    }
  };
  const passItem = (name: string, data: string, key: string, show: string) => {
    return (
      <div
        className="item"
        onClick={() => {
          if (Number(show)) {
            setLaunchTokenPass(key === launchTokenPass ? '' : key);
          }
        }}
      >
        <div>
          <div
            className="left"
            style={{
              backgroundColor: key === 'gloden' ? '#DBC926' : '#86F097',
            }}
          >
            <img src="/passLogo.svg" alt="" />
          </div>
          <div className="right">
            <p>{name}</p>
            <p>{data}</p>
          </div>
        </div>
        <p
          className="select"
          style={{
            border:
              launchTokenPass === key
                ? '3px solid #86F097'
                : '1px solid #8C8C8C',
          }}
        ></p>
      </div>
    );
  };
  useEffect(() => {
    getPass();
  }, []);
  return (
    <div className="passBox">
      <p className="title">Service Fee Payment</p>
      <p className="hint" style={{ fontSize: '15px', margin: '8px 0' }}>
        0.08 ETH service fee applied for Token Creation. Free for D Pass or
        Golden Pass holder
      </p>
      {loading ? (
        <div className="passItem">
          {params?.launchBotCreationCnt &&
            passItem(
              'D Pass',
              Number(params?.launchBotCreationCnt)
                ? params?.launchBotCreationCnt
                : '0',
              'launch',
              params?.launchBotCreationCnt
            )}
          {params?.stopTs &&
            passItem(
              'Gloden Pass',
              Number(params?.stopTs)
                ? dayjs
                    .unix(Number(params?.stopTs))
                    .format('YYYY-MM-DD HH:mm:ss')
                : '暂未拥有',
              'gloden',
              params?.stopTs
            )}
          <div
            className="more"
            onClick={() => {
              setLaunchTokenPass('more' === launchTokenPass ? '' : 'more');
            }}
          >
            <p>Service Fee Payment</p>
            <p
              className="select"
              style={{
                border:
                  launchTokenPass === 'more'
                    ? '3px solid #86F097'
                    : '1px solid #8C8C8C',
              }}
            ></p>
          </div>
        </div>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <div className="showBot">
        <p className="hint">Important Notice:</p>
        <p className="hint">
          Please be aware that deploying a smart contract through the Launch bot
          will incur a service fee of 0.08 ETH. This fee is used for ongoing
          development, marketing, and token buybacks.
        </p>
      </div>
    </div>
  );
}
