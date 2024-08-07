import './index.less';
import React from 'react'
import { FormDataType } from './pages/LaunchFill/index.tsx';
const LaunchFill = React.lazy(() => import('./pages/LaunchFill/index.tsx'));

import { Route, Routes } from 'react-router-dom';
const LaunchHome = React.lazy(() => import('./pages/LaunchHome/index.tsx'));

import { useState, createContext } from 'react';
const ManageTokenList = React.lazy(() => import('./pages/ManageTokenList'));

const ManagePairListAndContract = React.lazy(() => import('./pages/ManagePairListAndContract'));

const ManageTokenDetail = React.lazy(() => import('./pages/ManageTokenDetail'));

const ManagePairDetail = React.lazy(() => import('./pages/ManagePairDetail'));

const LockLpList = React.lazy(() => import('./pages/LockLpList'));
const Result = React.lazy(() => import('./pages/Result'));

export const MintContext = createContext(null);
export const initFormData: Partial<FormDataType> = {
  decimals: '18',
  preventSwapBefore: '0',
  maxTxAmount: '20000',
  maxTaxSwap: '10000',
  taxSwapThreshold: '0',
  maxWalletSize: '20000',
  initialBuyTax: '0',
  initialSellTax: '0',
  finalBuyTax: '0',
  finalSellTax: '0',
  reduceBuyTaxAt: '0',
  reduceSellTaxAt: '0',
  payTokenType: '0',
};
function Mint() {
  const [launchTokenPass, setLaunchTokenPass] = useState('more');
  const [formData, setFormData] = useState<Partial<FormDataType>>(initFormData);
  const minContextValue = {
    formData,
    launchTokenPass,
    setLaunchTokenPass,
    setFormData,
  };






  return (
    <div
      className="dis mint"
      style={{ height: 'calc(100vh - 90px)', justifyContent: 'center' }}
    >
      <div className="mint-box">
        <MintContext.Provider value={minContextValue}>
          <div className="mint-content">
            <Routes>
              <Route path="/" element={<LaunchHome />} />
              <Route
                path="/fillIn"
                element={
                  <LaunchFill formData={formData} setFormData={setFormData} />
                }
              />
              <Route path="/manageToken" element={<ManageTokenList />} />
              <Route path="/result/:id/:status" element={<Result />} />
              <Route
                path="/managePair/:id/:address/:name"
                element={<ManagePairListAndContract />}
              />
              <Route
                path="/tokenDetail/:address/:id"
                element={<ManageTokenDetail />}
              />
              <Route
                path="/pairDetail/:pair/:t0/:t1"
                element={<ManagePairDetail />}
              />
              <Route path="/lockLpList/:address" element={<LockLpList />} />
            </Routes>
          </div>
        </MintContext.Provider>
      </div>
    </div>
  );
}

export default Mint;
