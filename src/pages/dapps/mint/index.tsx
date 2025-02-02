import './index.less';
import { FormDataType } from './pages/LaunchFill/index.tsx';
import LaunchFill from './pages/LaunchFill/index.tsx';
import { Route, Routes } from 'react-router-dom';
import LaunchHome from './pages/LaunchHome/index.tsx';
import { useState, createContext } from 'react';
import ManageTokenList from './pages/ManageTokenList';
import ManagePairListAndContract from './pages/ManagePairListAndContract';
import ManageTokenDetail from './pages/ManageTokenDetail';
import ManagePairDetail from './pages/ManagePairDetail';
import NewResult from './pages/NewResult';
import ModifyForm from './pages/ModifyForm/index.tsx';

export const MintContext = createContext<{
  formData: Partial<FormDataType>;
  [x: string]: any;
}>(null);
export const initFormData: Partial<FormDataType> = {
  decimals: 18,
  totalSupply: '',
  name: '',
  symbol: '',
  description: '',
  logoLink: '',
  twitterLink: '',
  telegramLink: '',
  websiteLink: '',
  discordLink: '',
};
function Mint() {
  const [launchTokenPass, setLaunchTokenPass] = useState<string>('more');
  const [formData, setFormData] = useState<Partial<FormDataType>>(initFormData);
  const minContextValue: {
    formData: Partial<FormDataType>;
    [x: string]: any;
  } = {
    formData,
    launchTokenPass,
    setLaunchTokenPass,
    setFormData,
  };
  return (
    <div className="dis mint" style={{ justifyContent: 'center' }}>
      <div className="mint-box">
        <MintContext.Provider value={minContextValue}>
          <div className="mint-content">
            <Routes>
              <Route path="/" element={<LaunchHome />} />
              <Route path="/fillIn" element={<LaunchFill />} />
              <Route path="/manageToken" element={<ManageTokenList />} />
              <Route
                path="/managePair/:id/:address/:name"
                element={<ManagePairListAndContract />}
              />
              <Route
                path="/tokenDetail/:address"
                element={<ManageTokenDetail />}
              />
              <Route
                path="/pairDetail/:pair/:t0/:t1"
                element={<ManagePairDetail />}
              />
              <Route path="/edit/:address" element={<ModifyForm />} />
              {/* 签名后跳转的result页面，需要带tx */}
              <Route path="/results/:from/:tx" element={<NewResult />} />
            </Routes>
          </div>
        </MintContext.Provider>
      </div>
    </div>
  );
}

export default Mint;
