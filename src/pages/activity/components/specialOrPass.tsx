import './eventsList.less'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import Nodata from '../../../components/Nodata'
import cookie from "js-cookie";
import Loading from '../../../components/loading.tsx';
import Request from "../../../components/axios.tsx";
import { useEffect, useState } from 'react';
export default function specialOrPass({ option, data }: any) {
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
  const changeImg = (id: string) => {
    if (id === '1') {
      return '/launchPass.svg'
    } else if (id === '2') {
      return '/sniperPass.svg'
    } else if (id === '3') {
      return '/swapPass.svg'
    } else if (id === '4') {
      return '/goldenPass.svg'
    }
  }
  return (
    <div className="specialOrPass" style={{ flexDirection: option === 'special' ? "column" : 'row' }}>
      {
        option === 'special' ? data.length > 0 ? data.map((i: any, ind: number) => {
          return <div className='special' key={ind}>
            <p>{i?.campaign?.title}</p>
            <div className='img'>
              <img src={i?.campaign?.noticeUrl?.[0]} alt="" style={{ display: 'block', borderRadius: '10px' }} />
              <img src="/Recta.svg" alt="" onClick={() => {
                history('/specialActive/' + i?.campaign?.campaignId)
              }} />
            </div>
          </div>
        }) : <Nodata />
          : <div className='pass'>
            {
              !load ? <Loading status={'20'} /> : passPar.length > 0 ? passPar.map((i: any, ind: number) => {
                return <div className='it' key={ind}>
                  <img src={changeImg(i?.passId)} alt="" onClick={() => {
                    history('/Dpass/' + i?.passId)
                  }} />
                  <div>
                    <span>{i?.name}</span>
                    <span>{t('Active.Balance')}: {i?.balance || 0}</span>
                  </div>
                </div>
              }) : <Nodata />
            }
          </div>
      }
    </div>
  )
}
