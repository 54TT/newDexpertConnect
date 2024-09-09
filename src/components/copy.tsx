import copy from 'copy-to-clipboard';
import { Popover } from 'antd';
import { throttle } from 'lodash-es';
import { useContext } from 'react';
import { CountContext } from '../Layout.tsx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
function Copy({
  name,
  setSelect,
  select,
  img,
  change, //是否需要隐藏复制成功
}: any) {
  const { t } = useTranslation();
  const { isCopy, setIsCopy }: any = useContext(CountContext);
  useEffect(() => {
    if (isCopy) {
      setTimeout(() => {
        setIsCopy(false);
        setSelect('more');
      }, 4000);
    }
  }, [isCopy]);
  return (
    <Popover
      placement="top"
      title={''}
      overlayClassName={'newPairLeftPopover'}
      content={isCopy ? t('token.Copied') : t('token.copy')}
    >
      {((isCopy && !select) || (isCopy && select === 'select')) && !change ? (
        <img
          src="/copySucc.svg"
          alt=""
          style={{
            width: '15px',
            height: '15px',
            fontSize: '15px',
            marginLeft: '5px',
            color: img ? 'rgb(134,240,151)' : 'black',
          }}
        />
      ) : (
        <img
          src={img ? img : '/copy.svg'}
          alt=""
          loading={'lazy'}
          style={{
            width: '15px',
            height: '15px',
            cursor: 'pointer',
            marginLeft: '8px',
          }}
          onClick={throttle(
            function (e) {
              e.stopPropagation();
              copy(name);
              setIsCopy(true);
            },
            1500,
            { trailing: false }
          )}
        />
      )}
    </Popover>
  );
}

export default Copy;
