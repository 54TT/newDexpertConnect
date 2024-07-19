import './index.less';
import LaunchForm from './component/LaunchForm';
import { Route, Routes } from 'react-router-dom';
import LaunchHome from './component/LaunchHome';
import { useState } from 'react';
import ManageTokenList from './component/ManageTokenList';
function Mint() {
  const [formData, setFormData] = useState({});
  return (
    <div
      className="dis mint"
      style={{ height: 'calc(100vh - 90px)', justifyContent: 'center' }}
    >
      <div className="mint-box">
        <div className="mint-content">
          <Routes>
            <Route path="/" element={<LaunchHome />}></Route>
            <Route
              path="/form"
              element={
                <LaunchForm formData={formData} setFormData={setFormData} />
              }
            ></Route>
            <Route path="/manageToken" element={<ManageTokenList />}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Mint;
