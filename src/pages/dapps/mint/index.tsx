import './index.less';
import LaunchForm, { FormDataType } from './component/LaunchForm';
import { Route, Routes } from 'react-router-dom';
import LaunchHome from './component/LaunchHome';
import { useState, createContext } from 'react';
import ManageTokenList from './component/ManageTokenList';
import ConfirmPage from './component/ConfirmPage.tsx';
import ManagePairAndContract from './component/ManagePairAndContract/index.tsx';

export const MintContext = createContext(null);
const initFormData: Partial<FormDataType> = {
  decimals: '18',
  preventSwapBefore: '0',
  maxTxAmount: '20000',
  maxTaxSwap: '10000',
  taxSwapThreshold: '0',
  buyCount: '0',
  maxWalletSize: '20000',
  initialBuyTax: '1',
  initialSellTax: '1',
  finalBuyTax: '1',
  finalSellTax: '1',
  reduceBuyTaxAt: '1',
  reduceSellTaxAt: '1',
  payTokenType: '0',
};
function Mint() {
  const [formData, setFormData] = useState<Partial<FormDataType>>(initFormData);
  const minContextValue = { formData };
  return (
    <div
      className="dis mint"
      style={{ height: 'calc(100vh - 90px)', justifyContent: 'center' }}
    >
      <div className="mint-box">
        <MintContext.Provider value={minContextValue}>
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
              <Route path="/managePair" element={<ManagePairAndContract />} />
              <Route path="/confirm/:from" element={<ConfirmPage />} />
            </Routes>
          </div>
        </MintContext.Provider>
      </div>
    </div>
  );
}

export default Mint;
