import { useContext } from 'react';
// import Right from './components/right.tsx';
import { CountContext } from '@/Layout.tsx';
// import Left from './components/left.tsx';
import { createWallet } from 'thirdweb/wallets';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/client.ts';
import './index.less';
function Index() {
  const { browser }: any = useContext(CountContext);
  // window.open('www.baidu.com','','height=200,width=200,scrollbars=no,location=yes,status=yes,menubar=no,toolbar=no')
  const wallets = [
    // inAppWallet({
    // auth: {
    // options: [
    //   'passkey',
    //   'phone',
    //   'apple',
    // ],
    // },
    // }),
    createWallet('io.metamask'),
    createWallet('com.coinbase.wallet'),
    createWallet('me.rainbow'),
    createWallet('io.rabby'),
    createWallet('io.zerion.wallet'),
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 1% 0 1%',
        flexDirection: browser ? 'row' : 'column',
      }}
    >
      <ConnectButton
        client={client}
        wallets={wallets}
        connectButton={{ label: '你好' }}
        connectModal={{ size: 'compact' }}
        auth={{
          async doLogin(params) {
            console.log(params);
            // 登录
          },
          async doLogout() {
            // 退出
            console.log(111111111111111);
          },
          async getLoginPayload(params) {
            return {
              ...params,
              domain: 'http://localhost:5173',
              statement: '我好',
              version: '1',
              nonce: '你好',
              issued_at: '2024-8-30',
              expiration_time: '2024-9-30',
              invalid_before: '2024-10-30',
            };
          },
          async isLoggedIn(address: string) {
            console.log(address);
            if (address) {
              return true;
            } else {
              return false;
            }
          },
        }}
      />
      {/* <Left /> */}
      {/* <Right /> */}
    </div>
  );
}

export default Index;
