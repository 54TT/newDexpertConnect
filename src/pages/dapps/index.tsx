import Swap from './swap';
import './index.less';
import { Navigate, Route, Routes } from 'react-router-dom';
function Dapps() {
  return (
    <div className="dapps">
      <Routes>
        <Route path="/" element={<Navigate to="/dapps/swap" />}></Route>
        <Route path="/swap" element={<Swap />} />
      </Routes>
    </div>
  );
}

export default Dapps;
