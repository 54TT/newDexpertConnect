import { useContext } from 'react';
import Right from './components/right.tsx';
import { CountContext } from '@/Layout.tsx';
import Left from './components/left.tsx';
import './index.less';
function Index() {
  const { browser }: any = useContext(CountContext);
  // const aa = /^(http|https):\/\/(\S+)$/;

  // window.open('www.baidu.com','','height=200,width=200,scrollbars=no,location=yes,status=yes,menubar=no,toolbar=no')
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 1% 0 1%',
        flexDirection: browser ? 'row' : 'column',
      }}
    >
      <Left />
      {0 && <Right />}
    </div>
  );
}

export default Index;
