// import Request from '@/components/axios.tsx';
// import cookie from 'js-cookie';

export default function WalletDetail({id,setShowWalletDetail}: any) {
  // const {getAll}=Request();

  // const getWalletDetail=async(page:number)=>{

  // }
  return (
    <div className="walletDetail">
      walletDetail+{id}
      <button onClick={()=>{setShowWalletDetail(false)}}>back</button>
    </div>
  )
}