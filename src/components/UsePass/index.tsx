import './index.less';
import { useContext, useEffect, useState } from 'react';
import Request from '../axios';

import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import SelectComp from '@/components/SelectComp';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
function UsePass({ type, onChange, payType, refreshPass, status }: any) {
  const { isLogin, chainId } = useContext(CountContext);
  const { t } = useTranslation();
  // 0 付钱 1 gloden 2 swap
  /*   const [dpassCount, setDapssCount] = useState('0'); // 剩余的dpass次数 需要区分swap snip limit
  const [glodenEndTime, setGlodenEndTime] = useState('0'); // 金卡到期时间 */
  const [payTypeList, setPayTypeList] = useState([]);
  const { getAll } = Request();
  const getPassInfo = async () => {
    const token = Cookies.get('token');
    try {
      const {
        data: { sniperBotSwapCnt, stopTs },
      }: any = await getAll({
        method: 'get',
        url: '/api/v1/d_pass/info',
        token,
        chainId,
      });
      if (type === 'swap') {
        /*         setDapssCount(sniperBotSwapCnt);
        setGlodenEndTime(stopTs); */
        let list = [
          {
            label: status
              ? t('Slider.0.5% Dexpert service fee')
              : t('Slider.0.2% Dexpert service fee'),
            key: '0',
            title: (
              <>
                <Tag color="#aaa" style={{ color: 'black' }}>
                  {status ? '0.5% fee' : '0.2% fee'}
                </Tag>
              </>
            ),
          },
        ];
        if (sniperBotSwapCnt !== '0') {
          const data = {
            label: 'D Pass',
            key: '2',
            title: (
              <>
                <Tag color="#86F097" style={{ color: 'black' }}>
                  D Pass (free)
                </Tag>
              </>
            ),
          };
          list.unshift(data);
        }
        if (stopTs !== '0') {
          const data = {
            label: 'Gloden Pass',
            key: '1',
            title: (
              <>
                <Tag color="#FFE380" style={{ color: 'black' }}>
                  Gloden Pass (free)
                </Tag>
              </>
            ),
          };
          list.unshift(data);
        }
        setPayTypeList(list);
      }
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (isLogin) {
      getPassInfo();
    }
  }, [isLogin, type]);

  useEffect(() => {
    if (isLogin && refreshPass) {
      getPassInfo();
    }
  }, [refreshPass]);

  return <SelectComp list={payTypeList} data={payType} onChange={onChange} />;
}

export default UsePass;
