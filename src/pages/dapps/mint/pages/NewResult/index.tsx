import './index.less';
// import { useTranslation } from 'react-i18next';
// import BottomButton from '../../component/BottomButton';
// import ToLaunchHeader from '../../component/ToLaunchHeader';

import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import Loading from '@/components/allLoad/loading';
// import { useNavigate } from 'react-router-dom';
import { CountContext } from '@/Layout';
import NewResult from '../LaunchFill/components/newResult';
export default function index() {
  // const { t } = useTranslation();
  // const history = useNavigate();
  const router = useParams();
  const { contractConfig, browser } = useContext(CountContext);

  return (
    <>
      {contractConfig?.scan && router?.id ? (
        <div className="new-resultBox resultBox">
          {/* <ToLaunchHeader /> */}
          <NewResult />
          {/* <p
            className="view"
            onClick={() => window.open(contractConfig?.scan + router?.id)}
          >
            {t('token.view')} {contractConfig?.scanName}
          </p> */}
          <img src="/resultBack1.svg" alt="" className="resultBack1" />
          {/* <BottomButton
            text={t('token.Confirm')}
            bottom
            onClick={() => history(-1)}
          /> */}
        </div>
      ) : (
        <Loading status="20" browser={browser} />
      )}
    </>
  );
}
