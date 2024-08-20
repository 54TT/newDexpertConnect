import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CountContext } from '@/Layout.tsx';
import { throttle } from 'lodash-es';
import { Swiper, SwiperSlide } from 'swiper/react';
function Left() {
  const history = useNavigate();
  const params: any = useParams();
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const { user, setIsModalOpen, setActivityOptions }: any =
    useContext(CountContext);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (params?.id) {
      setValue(params?.id);
    }
  }, [params]);
  const { t } = useTranslation();
  const LeftTab = [
    {
      label: t('Dapps.Token Creation Bot'),
      key: 'create',
    },
    {
      label: t('Dapps.sniper'),
      key: 'sniper',
    },
    {
      label: t('Dapps.Air drop Bot'),
      key: 'Air',
    },
    {
      label: t('Dapps.Market maker'),
      key: 'Market',
    },
    {
      label: 'D Pass',
      key: 'D',
    },
    {
      label: t('Dapps.New Buy Notification'),
      key: 'New',
    },
    {
      label: t('Dapps.Token Checker'),
      key: 'Checker',
    },
    {
      label: t('Dapps.Trending'),
      key: 'Trending',
    },
  ];
  const changeImg = (it: string) => {
    if (it === 'create') {
      if (it === value) {
        return '/create.png';
      } else {
        return '/tokenWhite.svg';
      }
    } else if (it === 'sniper') {
      if (it === value) {
        return '/sniper1.png';
      } else {
        return '/sniperWhite.svg';
      }
    } else if (it === 'Air') {
      return '/dropBot.svg';
    } else if (it === 'Market') {
      return '/money.svg';
    } else if (it === 'D') {
      return '/padds.svg';
    } else if (it === 'New') {
      return '/news.svg';
    } else if (it === 'Checker') {
      return '/checker.svg';
    } else if (it === 'Trending') {
      return '/trending.svg';
    }
  };
  const back = (name: string) => {
    if (swiperRef) {
      if (name === 'left') {
        swiperRef.slideTo(swiperRef.activeIndex - 1);
      } else {
        swiperRef.slideTo(swiperRef.activeIndex + 1);
      }
    }
  };
  return (
    <div className={'topChange'}>
      <img src="/Polygon6.svg" alt="" onClick={() => back('left')} />
      <div className="swiperBox">
        <Swiper
          onSwiper={setSwiperRef}
          watchSlidesProgress={true}
          slidesPerView={4.6}
        >
          {LeftTab.map(({ label, key }: any) => {
            return (
              <SwiperSlide key={key}>
                {' '}
                <p
                  key={key}
                  className={'list'}
                  onClick={throttle(
                    function () {
                      if (key === 'D') {
                        if (user?.address) {
                          setActivityOptions('d');
                          history('/activity');
                        } else {
                          setIsModalOpen(true);
                        }
                      } else if (key === 'sniper') {
                        history('/app/sniper');
                        setValue(key);
                      } else if (key === 'create') {
                        history('/app/create');
                        setValue(key);
                      }
                    },
                    1500,
                    { trailing: false }
                  )}
                  style={{
                    color:
                      key === value
                        ? 'black'
                        : key === 'D' || key === 'create' || key === 'sniper'
                          ? 'white'
                          : 'rgb(104,124,105)',
                    cursor:
                      key === 'D' || key === 'create' || key === 'sniper'
                        ? 'pointer'
                        : 'auto',
                    backgroundColor:
                      key === value ? 'rgb(134,240,151)' : 'transparent',
                  }}
                >
                  <img loading={'lazy'} src={changeImg(key)} alt="" />
                  <span>{label}</span>
                  {(key === 'Air' ||
                    key === 'New' ||
                    key === 'Checker' ||
                    key === 'Trending' ||
                    key === 'Market') && (
                    <span className="dappComingSoon">
                      {t('Common.Coming soon')}
                    </span>
                  )}
                </p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <img src="/Polygon5.svg" alt="" onClick={() => back('right')} />
    </div>
  );
}

export default Left;
