import './eventsList.less'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import Nodata from '../../../components/Nodata'
import cookie from "js-cookie";
import Loading from '../../../components/loading.tsx';
import Request from "../../../components/axios.tsx";
import { CountContext } from "../../../Layout.tsx";
import { useEffect, useState, useContext } from 'react';
export default function specialOrPass({ option, data }: any) {
  const { browser }: any = useContext(CountContext);
  const { t } = useTranslation();
  const { getAll, } = Request()
  const [passPar, setPassPar] = useState([])
  const [load, setLoad] = useState(false)
  const history = useNavigate()
  const getDpass = async (token: string) => {
    const res: any = await getAll({
      method: 'get', url: '/api/v1/d_pass/list', data: { page: 1 }, token
    })
    if (res?.status === 200 && res?.data?.list) {
      setPassPar(res?.data?.list)
      setLoad(true)
    }
  }
  useEffect(() => {
    const token = cookie.get('token')
    if (option === 'd' && token && passPar.length === 0 && !load) {
      getDpass(token)
    }
  }, [option])
  const changeImg = (name: string, sta: string) => {
    if (name.includes('Golden')) {
      if (sta === 'img') {
        return '/goldenPass.svg'
      } else if (sta === 'num') {
        return 'Activity acquisition'
      }
    } else if (name.includes('Creation')) {
      if (sta === 'img') {
        return '/launchPass.png'
      } else if (sta === 'num') {
        return '6000'
      }
    } else if (name.includes('Trade')) {
      if (sta === 'img') {
        return '/trade.png'
      } else if (sta === 'num') {
        return '480'
      }
    } else if (name.includes('Sniper')) {
      if (sta === 'img') {
        return '/sniper.png'
      } else if (sta === 'num') {
        return '1200'
      }
    }
  }
  return (
    <div className="specialOrPass" style={{ flexDirection: option === 'special' ? "column" : 'row' }}>
      {
        option === 'special' ? data.length > 0 ? data.map((i: any, ind: number) => {
          return <div className='special' key={ind}>
            <p>{i?.campaign?.title}</p>
            <div className='img' style={{ width: browser ? '50%' : '100%' }}>
              <img src={i?.campaign?.noticeUrl?.[0]} alt="" style={{ display: 'block', borderRadius: '10px', cursor: 'pointer', zIndex: '1' }} onClick={() => {
                history('/specialActive/' + i?.campaign?.campaignId)
              }} />
              {
                browser && <img src="/Recta.svg" alt="" style={{ zIndex: '1' }} className='positionImg' onClick={() => {
                  history('/specialActive/' + i?.campaign?.campaignId)
                }} />
              }
            </div>
          </div>
        }) : <Nodata />
          : <div className='pass' style={{ flexDirection: browser ? 'row' : 'column' }}>
            {
              !load ? <Loading status={'20'}  browser={browser}/> : passPar.length > 0 ? passPar.map((i: any, ind: number) => {
                return <div className='it' style={{ width: browser ? "46%" : '100%' }} key={ind}>
                  <img src={changeImg(i?.name, 'img')} style={{ zIndex: '1' }} alt="" onClick={() => {
                    history('/Dpass/' + i?.passId)
                  }} />
                  <div>
                    <span>{i?.name}</span>
                    <span>{changeImg(i?.name, 'num')} {!(i?.name?.includes('Golden')) && t('Active.points')}</span>
                  </div>
                </div>
              }) : <Nodata />
            }
          </div>
      }
    </div>
  )
}
