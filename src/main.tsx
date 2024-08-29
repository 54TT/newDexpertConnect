import ReactDOM from 'react-dom/client';
import Layout from './Layout.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';
import {TonConnectUIProvider} from '@tonconnect/ui-react';
import { ThirdwebProvider } from "thirdweb/react";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThirdwebProvider>
  <TonConnectUIProvider manifestUrl="https://sniper-bot-frontend-test.vercel.app/tonconnect-manifest.json">
    <Router>
      <Layout />
    </Router>
  </TonConnectUIProvider>
  </ThirdwebProvider>
);
