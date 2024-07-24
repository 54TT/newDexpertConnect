import ReactDOM from 'react-dom/client';
import Layout from './Layout.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';
import {TonConnectUIProvider} from '@tonconnect/ui-react';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl="https://sniper-bot-frontend-test.vercel.app/tonconnect-manifest.json">
    <Router>
      <Layout />
    </Router>
  </TonConnectUIProvider>
);
