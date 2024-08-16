import { Modal,  } from 'antd';
import { useContext, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import { useTranslation } from 'react-i18next';
import cookie from 'js-cookie';
import TwitterRelease from'./twitterRelease'
import Revalidate from'./revalidate'
import Request from '@/components/axios.tsx';
export default function modal({
  isModalOpen,
  handleCancel,
  select,
  option,
  link,
  setIsModalOpe,
}) {
  const { t } = useTranslation();
  const { getAll } = Request();
  const [value, setValue] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const openLink = () => {
    if (link) {
      window.open(link);
    }
  };
  const { browser }: any = useContext(CountContext);
  const Confirm = async () => {
    const token = cookie.get('token');
    if (value && token && select) {
      setIsConfirm(true);
      const res: any = await getAll({
        method: 'post',
        url: '/api/v1/airdrop/task/twitter/daily/confirm',
        data: { taskId: select, url: value },
        token,
      });
      if (res?.status === 200 && res?.data?.message === 'success') {
        setIsModalOpe(false);
        setIsConfirm(false);
      } else {
        setIsConfirm(false);
      }
    }
  };

  return (
    <Modal
      centered
      style={{ width: browser ? '30%' : '90%' }}
      title={
        (select === '8' || select === '10') && option === 'daily'
          ? t('Dpass.how')
          : t('Dpass.plea')
      }
      className={'activeModal'}
      open={isModalOpen}
      maskClosable={false}
      footer={null}
      onCancel={handleCancel}
    >
      {(select === '8' || select === '10') && option === 'daily' ? (
        <TwitterRelease
          handleCancel={handleCancel}
          openLink={openLink}
          setValue={setValue}
          Confirm={Confirm}
          isConfirm={isConfirm}
        />
      ) : (
        <Revalidate openLink={openLink} select={select} />
      )}
    </Modal>
  );
}
