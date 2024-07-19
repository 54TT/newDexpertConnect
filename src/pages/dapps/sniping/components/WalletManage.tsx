import { useContext, useEffect, useState } from 'react';
import './index.less'
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { CountContext } from '@/Layout';
import Loading from '@components/allLoad/loading';
import Load from '@/components/allLoad/load';
import WalletDetail from './WalletDetail';
import getBalance from '@utils/getBalance';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function WalletManage({id}: any) {
  const { browser }: any = useContext(CountContext);
  const [loading, setLoading] = useState(false)
  const [nextLoad, setNextLoad] = useState(false);

  const [walletList, setWalletList] = useState([]);
  const [showWalletDetail,setShowWalletDetail]=useState(false)
  const [page, setPage] = useState(1);
  const [isNext,setIsNext] = useState(false)
  const { getAll } = Request();
  const getWalletList = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/list',
      data: { page },
      token,
    });
    if(res?.status === 200){
      let addressList: any = []
      console.log(res);
      if(res?.data?.list?.length > 0 ) {
        res?.data?.list.map((item:any)=>{
          addressList.push(item.address)
        })
        const priceAll = await getBalance(addressList,id.toString())
        if(priceAll.length > 0){
          const priceList= priceAll.map((item:any)=>{
            item.balance = Number(item.balance)?(item.balance / 10**18).toFixed(3):0;
            return item
          })
          const walletHasBalance = res?.data?.list.map((index:any)=>{
            priceList.map((item:any)=>{
              if(index.address === item.account){
                index.balance = item.balance
              }
            })
            return index
          })
          if(page === 1){
            setWalletList(walletHasBalance)
          }else{
            const exWallet = walletList.concat(walletHasBalance)
            setWalletList(exWallet)
          }
        } else{
          if(page ===1){
            setWalletList(res?.data?.list)
          }else{
            const exWallet = walletList.concat(res?.data?.list)
            setWalletList(exWallet)
          }
        }
      }
      if(res?.data?.list.length !== 10){
        setIsNext(true)
      }
      setLoading(true)
      setNextLoad(false)
    }else{
      setLoading(true)
      setNextLoad(false)
    }
  };

  // 选择某个钱包，展示钱包详情
  const selectWallet = (id: any) => {
    setShowWalletDetail(true);
    console.log(id);
    
  };
  // 创建钱包，未实现
  const createWallet = () => {
    console.log('createWallet');
    
  };
  const nextPage=()=>{
    if(!isNext){
      getWalletList(page+1);
      setPage(page+1);
      setNextLoad(true);
    }
  }
  useEffect(()=>{
    console.log(walletList);
  },[walletList])

  useEffect(() => {
    getWalletList(1);
  }, []);


  return (
    <div className="wallet-manage" id="walletManage">
      {
        loading && !showWalletDetail ? (
          <InfiniteScroll
            hasMore={true}
            next={nextPage}
            scrollableTarget={'walletManage'}
            loader={null}
            dataLength={walletList.length}
          >
            { walletList.length >0 ?(
              walletList.map((item:any)=>{
                return(
                  <div className="walletList-item"
                    onClick={()=>selectWallet(item)}
                  >
                    <span className='wallet-logo'>{item.name.toUpperCase().slice(0,1)}</span>
                    <div className='wallet-item-middle'>
                      <div className='wallet-name'>{item.name}</div>
                      <div className='wallet-address'>{item.address.slice(0,4)+'...'+item.address.slice(-4)}</div>
                    </div>
                    <span className='wallet-balance'>{item.balance} ETH</span>
                  </div>
                )
              })
            ):(
              <p className='no-wallet'>no wallet yet</p>
            )
          }
          
          </InfiniteScroll>
        ): ( !showWalletDetail &&
          <Loading status={'20'} browser={browser} />
          
        )
      }
      {
        showWalletDetail && (
          <WalletDetail id={id} setShowWalletDetail={setShowWalletDetail} showWalletDetail={showWalletDetail} />
        )
      }
      ( !nextLoad && <Load />)
      {/* 添加钱包，未实现 */}
      { loading &&
        <span className="add-wallet" onClick={createWallet}>Add wallet</span>
      }
    </div>
  )
}