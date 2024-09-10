import './index.less';
import { useTranslation } from 'react-i18next';
import BottomButton from '../../component/BottomButton';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import Loading from '@/components/allLoad/loading';
import { useNavigate } from 'react-router-dom';
import { CountContext } from '@/Layout';
export default function index() {
  const { t } = useTranslation();
  const history = useNavigate();
  const router = useParams();
  const { contractConfig, browser } = useContext(CountContext);
  const params = {
    lock: t('token.loSu'),
    unlock: t('token.unLoSu'),
    removeLimits: t('token.removeLimits'),
    renounceOwnership: t('token.renounceOwnership'),
    removeLP: t('token.removeLP'),
    burnLP: t('token.burnLP'),
  };
  return (
    <>
      {contractConfig?.scan && router?.id ? (
        <div className="resultBox">
          <ToLaunchHeader />
          <div className="center">
            <img src="/resultImg.svg" alt="" />
            <p>{params[router?.status] || ''}</p>
          </div>
          <p
            className="view"
            onClick={() => window.open(contractConfig?.scan + router?.id)}
          >
            {t('token.view')} {contractConfig?.scanName}
          </p>
          <img src="/resultBack1.svg" alt="" className="resultBack1" />
          <BottomButton
            text={t('token.Confirm')}
            bottom
            onClick={() => history(-1)}
          />
        </div>
      ) : (
        <Loading status="20" browser={browser} />
      )}
    </>
  );
}
