import './task.less'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function specialOrPass({ option }: any) {
  const { t } = useTranslation();
  const history = useNavigate()
  const pass = [{ name: t('Active.Golden'), balance: '0', key: 'golden', img: '/goldenPass.svg' }, { name: t('Active.Launch'), balance: '0', key: 'launch', img: '/launchPass.svg' }, { name: t('Active.Snipert'), balance: '0', key: 'sniper', img: '/swapPass.svg' }, { name: t('Active.swap'), balance: '0', key: 'wap', img: '/sniperPass.svg' }]

  return (
    <div className="specialOrPass">
      {
        option === 'special' ? <div className='special'>
          <p>DEXpert X Yuliverse</p>
          <div className='img'>
            <img src="/image1.svg" alt="" />
            <img src="/Recta.svg" alt="" onClick={() => {
              history('/specialActive/1')
            }} />
          </div>
        </div> : <div className='pass'>
          {
            pass.map((i: any, ind: number) => {
              return <div className='it' key={ind}>
                <img src={i?.img} alt="" onClick={() => {
                  history('/Dpass/' + i?.key)
                }} />
                <div>
                  <span>{i?.name}</span>
                  <span>{t('Active.Balance')}: {i?.balance}</span>
                </div>
              </div>
            })
          }
        </div>
      }
    </div>
  )
}
