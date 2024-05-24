import './index.less'
import { useContext, useEffect, useState } from 'react'
import { CountContext } from "../../../Layout.tsx";
import Copy from '../../../components/copy.tsx'
import { simplify } from '../../../../utils/change.ts'
import dayjs from 'dayjs'
import Request from "../../../components/axios.tsx";
import cookie from "js-cookie";
import Loading from '../../../components/loading.tsx';
import Nodata from '../../../components/Nodata.tsx';
import { CaretDownOutlined, LoadingOutlined } from '@ant-design/icons'
export default function person() {
  const { getAll, } = Request()
  const [page, setPage] = useState(1)
  const [load, setLoad] = useState(false)
  const [userPass, setUserPass] = useState<any>(null)
  const [history, setHistory] = useState([])
  const [isLoad, setIsLoad] = useState(false)
  const { user, browser }: any = useContext(CountContext);
  const getPointHistory = async (page: number) => {
    const token = cookie.get('token')
    const res = await getAll({
      method: 'post', url: '/api/v1/rewardPoint/history', data: { page }, token
    })
    if (res?.status === 200) {
      if (page === 1) {
        setHistory(res?.data?.list)
      } else {
        const at = history.concat(res?.data?.list)
        setHistory([...at])
      }
      setLoad(false)
    } else {
      setLoad(false)
    }
  }
  const getUserPass = async () => {
    const token = cookie.get('token')
    const res = await getAll({
      method: 'get', url: '/api/v1/d_pass/info', data: {}, token
    })
    if (res?.status === 200) {
      setUserPass(res?.data)
      setIsLoad(true)
    }
  }
  const passCard = [{ name: 'Golden Pass:', data: Number(userPass?.stopTs) ? dayjs.unix(userPass?.stopTs).format('YYYY-MM-DD') : 'Not owned' }, { name: 'Fast Trade Pass:', data: userPass?.sniperBotSwapCnt || 0 }, { name: 'Sniper Bot Pass:', data: userPass?.sniperBotPreswapCnt || 0 }, { name: 'Token Creation Bot Pass:', data: userPass?.launchBotCreationCnt || 0 }]
  useEffect(() => {
    const token = cookie.get('token')
    if (user && token) {
      getPointHistory(1)
      getUserPass()
    }
  }, [user])
  const next = () => {
    getPointHistory(page + 1)
    setPage(page + 1)
    setLoad(true)
  }
  const left = <div style={{ width: browser ? '40%' : '100%', marginRight: browser ? '2%' : '0' }} className='boxLeft'>
    <div className='tittle'>
      <img src={user?.avatarUrl || '/topLogo.png'} alt="" />
      <div>
        <p>{simplify(user?.username)}</p>
        <p><span>address:{simplify(user?.address)}</span> <Copy name={user?.address} /></p>
      </div>
    </div>
    <div className='point dis'>
      <span>D points:</span>
      <span>{user?.rewardPointCnt || 0}</span>
    </div>
  </div>

  const right = <div className={`boxRight ${browser ? '' : 'boxRightSpacing'}`}>
    {
      passCard.map((i: any, ind: number) => {
        return <div key={ind} className='dis'>
          <span>{i?.name}</span>
          <span>{i?.data}</span>
        </div>
      })
    }
  </div>

  return (
    <>
      {
        isLoad ? <div className="activityPerson">
          <div className='box' style={{ width: browser ? '70%' : '90%', margin: browser ? "5% auto 60px" : '30px auto 60px' }}>
            <div className='person'>
              {left}
              {browser && right}
              <img src="/GroupPass.svg" alt="" className='passCard' style={{ width: browser ? '10%' : '80px', transform: browser ? 'translate(30%,-50%)' : 'translate(10%,-30%)' }} />
              {
                browser && <img src="/coinPass.svg" alt="" className='coinPass' style={{ width: browser ? '8.5%' : '80px', transform: 'translate(-50%,55%)' }} />
              }
            </div>
            {
              !browser && right
            }
            <div className='list' style={{ padding: browser ? "3% 6%" : '45px 20px', marginTop: browser ? "10%" : '65px' }}>
              <div className='data dis top'>
                <span>Time</span>
                <span>Task</span>
                <span>Integral</span>
              </div>
              {
                history.length > 0 ? history.map((i: any, ind: number) => {
                  return <div className='data dis bot' key={ind}>
                    <span>{i?.timestamp ? dayjs(i?.timestamp).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
                    <span>{i?.description}</span>
                    <span>+{i?.score || 0}</span>
                  </div>
                }) : <Nodata />
              }
              {
                history.length > 0 && !(history.length % 10) && <p className='next disCen' onClick={next}><span>下一页</span> {load ? <LoadingOutlined /> : <CaretDownOutlined />}</p>
              }
              <img src="/GroupPass.svg" alt="" className='passCard' style={{ width: browser ? '10%' : '80px', transform: browser ? 'translate(-50%,-50%)' : 'translate(-10%,-50%)' }} />
              <img src="/coinPass.svg" alt="" className='coinPass' style={{ width: browser ? '8.5%' : '80px', transform: browser ? 'translate(50%,-50%)' : 'translate(13%,-50%)' }} />
            </div>
          </div>
          <div className='backgroundColor' style={{ top: '15vh', background: '#86F097', left: "0" }}></div>
          <div className='backgroundColor' style={{ top: '10vh', background: '#0FF', right: '0' }}></div>
        </div> : <Loading status={'20'} />
      }
    </>
  )
}
