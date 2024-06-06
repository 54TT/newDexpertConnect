import './index.less'
import { useContext, useEffect, useState } from 'react'
import { CountContext } from "../../../Layout.tsx";
import Copy from '../../../components/copy.tsx'
import { simplify } from '../../../../utils/change.ts'
import dayjs from 'dayjs'
import { Popover } from 'antd'
import Request from "../../../components/axios.tsx";
import cookie from "js-cookie";
import Loading from '../../../components/allLoad/loading.tsx';
import Load from '../../../components/allLoad/load.tsx';
import Nodata from '../../../components/Nodata.tsx';
import { CaretDownOutlined, } from '@ant-design/icons'

export default function person() {
  const { getAll, } = Request()
  const [page, setPage] = useState(1)
  const [load, setLoad] = useState(false)
  const [userPass, setUserPass] = useState<any>(null)
  const [history, setHistory] = useState([])
  const [isLoad, setIsLoad] = useState(false)
  const { user, browser }: any = useContext(CountContext);
  const [open, setOpen] = useState(false);

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
  const chainContent = (
    <div className='personBox' style={{ width: browser ? '20vw' : '40vw' }}>
      <div className='top'>
        <p></p>
        <p>Link Wallet</p>
        <p onClick={() => setOpen(false)}>x</p>
      </div>
      <div className='chain'>
        {
          [{ name: 'ETH', img: '/MetaMasketh.png' }, { name: 'Sol', img: '/MetaMasksol.png' }, { name: 'Ton', img: '/Groupton.png' }].map((i: any, ind: number) => {
            return <div className='other' key={ind} style={{ border: '1px solid rgb(134,240,151)' }}>
              <div>
                <img src={i?.img} alt="" />
                <p>{i?.name}</p>
              </div>
              <p style={{ color: "rgb(141,143,141)" }}>Bound</p>
              {/*   UnBound */}
            </div>
          })
        }
      </div>
    </div>
  );
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const left = <div style={{ width: browser ? '55%' : '100%', marginRight: browser ? '2%' : '0' }} className='boxLeft'>
    <div className='tittle'>
      <img src={user?.avatarUrl || '/topLogo.png'} alt="" style={{ width: browser ? '22.5%' : '80px' }} />
      <p>{simplify(user?.username)}</p>
    </div>
    <div className='address'>
      <p className='topLeft'><span>address:{simplify(user?.address)}</span> <Copy name={user?.address} /></p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className='img'>
          <img src="/MetaMask.png" alt="" />
          <img src="/ton.png" alt="" />
          <img src="/solano.png" alt="" />
        </div>
        <Popover content={chainContent} rootClassName={'personChainName'} open={open} onOpenChange={handleOpenChange} title="" trigger="click">
          <img src="/addChain.png" alt="" style={{ cursor: 'pointer', display: 'block', marginLeft: '6px' }} />
        </Popover>
      </div>
    </div>
  </div>

  const right = <div className={`boxRight ${browser ? '' : 'boxRightSpacing'}`}>
    <div className='point dis'>
      <span>D points:</span>
      <span>{user?.rewardPointCnt || 0}</span>
    </div>
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
          <div className='box' style={{ width: browser ? '85%' : '90%', margin: browser ? "5% auto 60px" : '30px auto 60px' }}>
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
            <div className='Invite'>
              <div style={{ display: 'flex', width: '80%' }}>
                <div className='left'>
                  <div className='leftTop'><p>Invite</p><img src="/rightLi1.png" alt="" /></div>
                  <div className='leftBot'>
                    <p>Application form</p>
                    <p>Invite Link</p>
                  </div>
                </div>
                <div className='centerNow'>
                  <p>number of invitees</p>
                  <p>100</p>
                </div>
              </div>
              <div className='rightNow'>
                {
                  ["/coinPass.svg", "/coinPass.svg", "/coinPass.svg"].map((i: string, ind: number) => {
                    return <img src={i} key={ind} alt="" />
                  })
                }

              </div>
            </div>
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
                history.length > 0 && !(history.length % 10) && <div className='next disCen' onClick={next}><span>下一页</span> {load ? <Load /> : <CaretDownOutlined />}</div>
              }
              <img src="/GroupPass.svg" alt="" className='passCard' style={{ width: browser ? '10%' : '80px', transform: browser ? 'translate(-50%,-50%)' : 'translate(-10%,-50%)' }} />
              <img src="/coinPass.svg" alt="" className='coinPass' style={{ width: browser ? '8.5%' : '80px', transform: browser ? 'translate(50%,-50%)' : 'translate(13%,-50%)' }} />
            </div>
          </div>
          <div className='backgroundColor' style={{ top: '15vh', background: '#86F097', left: "0" }}></div>
          <div className='backgroundColor' style={{ top: '10vh', background: '#0FF', right: '0' }}></div>
        </div> : <Loading status={'20'} browser={browser} />
      }
    </>
  )
}
