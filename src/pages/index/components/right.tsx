import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { useContext, useState, useRef, useEffect } from 'react';
import TweetHome from '../../../components/tweetHome.tsx';
import { CountContext } from '../../../Layout.tsx';
import { throttle } from 'lodash';
import { Segmented } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Right() {
  const history = useNavigate();
  const { t } = useTranslation();
  const swiperHei = useRef<any>(null);
  const { browser }: any = useContext(CountContext);
  const [select, setSelect] = useState('one');
  const [heigh, setHei] = useState<any>(null);
  useEffect(() => {
    const hei = window?.innerHeight - swiperHei?.current?.clientHeight - 130;
    setHei(hei);
  }, [swiperHei?.current]);
  return (
    <div
      className={'rightBox'}
      style={{
        width: browser ? '25%' : '100%',
        marginBottom: browser ? '0' : '40px',
      }}
    >
      <div
        ref={swiperHei}
        style={{ margin: browser ? '0' : '40px 0', width: '100%' }}
      >
        <Swiper
          slidesPerView={1}
          modules={[EffectFade, Autoplay, Pagination, A11y]}
          pagination={{
            clickable: true,
          }}
          loop
          autoplay={{ delay: 2000, disableOnInteraction: false }}
        >
          {[
            '/poster1.png',
            '/poster2.png',
            '/poster3.png',
            '/poster4.png',
            '/poster5.png',
          ].map((i, ind) => {
            return (
              <SwiperSlide key={ind}>
                <img
                  loading={'lazy'}
                  src={i}
                  onClick={throttle(
                    function () {
                      history('/activity');
                    },
                    1500,
                    { trailing: false }
                  )}
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                  alt=""
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div
        className={'rightBoxTweet'}
        style={{
          height: browser ? heigh + 60 + 'px' : '50vh',
          borderRadius: '15px 15px 0 0',
        }}
      >
        <Segmented
          rootClassName="rightSegmented"
          value={select}
          block
          options={[{label:t('Common.Recommand'),value:'one'}, {label:t('Common.Lastest'),value:'two'}]}
          onChange={(value: any) => {
            if (select !== value) {
                setSelect(value);
              }
          }}
        />
        <TweetHome hei={`${heigh}px`} />
      </div>
    </div>
  );
}

export default Right;
