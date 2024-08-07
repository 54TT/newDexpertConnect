import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import { simplify } from '@/../utils/change.ts';
import cookie from 'js-cookie';
import { Popover } from 'antd';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import Copy from '@/components/copy.tsx';
export default function left() {
  const currentAddress = cookie.get('currentAddress');
  const token = cookie.get('token');
  const { t } = useTranslation();
  const { user, bindingAddress, browser, setIsModalOpen, changeBindind }: any =
    useContext(CountContext);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([
    { name: 'ETH', img: '/MetaMasketh.png' },
    { name: 'Sol', img: '/MetaMasksol.png' },
    { name: 'Ton', img: '/Groupton.png' },
  ]);
  useEffect(() => {
    if (user && token) {
      const at = list.map((i: any) => {
        bindingAddress.map((item: any) => {
          if (i.name.toLowerCase() === item.chainName.toLowerCase()) {
            i.address = item.address;
          }
        });
        return i;
      });
      setList(at);
    }
  }, [user]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const select = (i: any) => {
    setOpen(false);
    setIsModalOpen(true);
    changeBindind.current = i.name;
  };
  const chainContent = (
    <div className="personBox" style={{ width: browser ? '50vw' : '90vw' }}>
      <div className="top">
        <p></p>
        <p> {t('person.Wallet')}</p>
        <p
          onClick={throttle(
            function () {
              changeBindind.current = '';
              setOpen(false);
            },
            1500,
            { trailing: false }
          )}
        >
          x
        </p>
      </div>
      <div className="chain">
        {list.map((i: any, ind: number) => {
          return (
            <div
              className="other"
              key={ind}
              onClick={throttle(
                function () {
                  if (
                    i?.address &&
                    currentAddress?.toLocaleLowerCase() !==
                      i?.address?.toLocaleLowerCase()
                  ) {
                    setRefresh(!refresh);
                    cookie.set('currentAddress', i?.address);
                  }
                },
                1500,
                { trailing: false }
              )}
              style={{
                border:
                  currentAddress?.toLocaleLowerCase() ===
                  i?.address?.toLocaleLowerCase()
                    ? '1px solid rgb(134,240,151)'
                    : '1px solid gray',
              }}
            >
              <div>
                <img src={i?.img} alt="" />
                <p
                  style={{
                    color:
                      currentAddress?.toLocaleLowerCase() ===
                      i?.address?.toLocaleLowerCase()
                        ? 'rgb(141,143,141)'
                        : 'gray',
                  }}
                >
                  {i?.name}
                </p>
              </div>
              <p
                className="activePersonChain"
                style={{
                  width: browser ? '70%' : '50%',
                }}
              >
                {i?.address || ''}
              </p>
              <p
                onClick={throttle(
                  function () {
                    if (i.name !== 'Sol') {
                      select(i);
                    }
                  },
                  1500,
                  { trailing: false }
                )}
                style={{
                  whiteSpace: 'nowrap',
                  color:
                    i.name === 'Sol'
                      ? 'gray'
                      : i?.address
                        ? 'white'
                        : 'rgb(141,143,141)',
                  cursor: i.name === 'Sol' ? 'not-allowed' : 'pointer',
                }}
              >
                {i.name === 'Sol'
                  ? t('person.com')
                  : i?.address
                    ? t('person.chang')
                    : t('person.Unbound')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: browser ? '90%' : '100%',
        marginRight: browser ? '2%' : '0',
      }}
      className="boxLeft"
    >
      <div className="tittle">
        <img
          src={user?.avatarUrl || '/topLogo.png'}
          alt=""
          style={{ width: browser ? '22.5%' : '80px' }}
        />
        <p>{simplify(user?.username)}</p>
      </div>
      <div className="address">
        <p className="topLeft">
          <span>
            {t('person.address')}:
            {simplify(currentAddress ? currentAddress : user?.username)}
          </span>
          <Copy name={currentAddress ? currentAddress : user?.username} />
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="img">
            <img src="/MetaMask.png" alt="" />
            <img src="/ton.png" alt="" />
            <img src="/solano.png" alt="" />
          </div>
          <Popover
            content={chainContent}
            rootClassName={'personChainName'}
            open={open}
            onOpenChange={handleOpenChange}
            title=""
            trigger="click"
          >
            <img
              src="/addChain.png"
              alt=""
              style={{ cursor: 'pointer', display: 'block', marginLeft: '6px' }}
            />
          </Popover>
        </div>
      </div>
    </div>
  );
}
