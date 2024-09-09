import './index.less';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import Loading from '@/components/allLoad/loading';
import { CountContext } from '@/Layout';
import NewResult from '../LaunchFill/components/newResult';
export default function index() {
  const router = useParams();
  const { contractConfig, browser } = useContext(CountContext);
  return (
    <>
      {contractConfig?.scan && router?.id ? (
        <div className="new-resultBox resultBox">
          <NewResult />
          <img src="/resultBack1.svg" alt="" className="resultBack1" />
        </div>
      ) : (
        <Loading status="20" browser={browser} />
      )}
    </>
  );
}
