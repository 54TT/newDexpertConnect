import PassCardRadioItem from './components/PassCardRadioItem';
import './index.less';
import classnames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import Request from '../axios';
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
function UsePass({ open, type, onChange, onClose }) {
  const { isLogin } = useContext(CountContext);
  // 0 付钱 1 gloden 2 swap
  const [value, setValue] = useState<'1' | '2' | '0'>('0');
  const [dpassCount, setDapssCount] = useState('0'); // 剩余的dpass次数 需要区分swap snip limit
  const [glodenEndTime, setGlodenEndTime] = useState('0'); // 金卡到期时间
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
      });
      if (type === 'swap') {
        setDapssCount(sniperBotSwapCnt);
        setGlodenEndTime(stopTs);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isLogin == true) {
      getPassInfo();
    }
  }, [isLogin, type]);

  const confirmPayType = () => {
    onChange(value);
  };

  return (
    <Modal
      className="dpass-modal"
      centered
      open={open}
      title="D pass"
      footer={null}
      onCancel={onClose}
    >
      <div className="use-pass-page">
        <>
          <PassCardRadioItem
            radioValue="1"
            checked={value === '1'}
            disable={glodenEndTime === '0'}
            src="/GlodenPass.png"
            desc={
              glodenEndTime !== '0'
                ? dayjs.unix(Number(glodenEndTime || 0)).format('YYYY-MM-DD')
                : "Common.You don't have Gloden Pass"
            }
            name="Gloden Pass"
            className={classnames('gloden-card')}
            onClick={(v) => {
              setValue(v);
            }}
          />
          <PassCardRadioItem
            radioValue="2"
            checked={value === '2'}
            disable={dpassCount === '0'}
            src="/DpassToken.png"
            name="Dpass"
            desc={
              dpassCount !== '0'
                ? `${'Common.Balance'}:${dpassCount}`
                : "Common.You don't have D Pass"
            }
            className={classnames('normal-card')}
            onClick={(v) => {
              setValue(v);
            }}
          />
          <PassCardRadioItem
            radioValue="0"
            checked={value === '0'}
            src=""
            name={`${'Common.Pay transaction fees using Eth'}.`}
            desc=""
            className={classnames('pay-for-fee')}
            onClick={(v) => {
              setValue(v);
            }}
          />
          <div className="disCen" style={{ marginTop: '20px' }}>
            <Button
              style={{ width: '80%', borderRadius: '10px' }}
              className="action-button"
              onClick={confirmPayType}
            >
              Confirm
            </Button>
          </div>
        </>
      </div>
    </Modal>
  );
}

export default UsePass;
