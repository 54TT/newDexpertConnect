import {  useEffect, useState } from "react"
import { Table,Spin,Switch } from "antd"
import { useTranslation } from "react-i18next"

const OrderHistory = () => {
  const [orderList, setOrderList]=useState([])
  const {t}=useTranslation()
  const [loading,setLoading]=useState(false)
  const mockOrderList=[
    {
      key:'1',
      Time:'2023-03-01 12:00:00',
      FillAmount:'1000',
      EquivalentToken:'USDT',
      Deposited:'1000',
      TxHash:'0x1234567890',
      Status:'Success',
      Action:'View'
    },
    {
      key:'2',
      Time:'2023-03-01 12:00:00',
      FillAmount:'1000',
      EquivalentToken:'USDT',
      Deposited:'1000',
      TxHash:'0x1234567890',
      Status:'Success',
      Action:'View'
    },
    {
      key:'3',
      Time:'2023-03-01 12:00:00',
      FillAmount:'1000',
      EquivalentToken:'USDT',
      Deposited:'1000',
      TxHash:'0x1234567890',
      Status:'Success',
      Action:'View'
    },
    {
      key:'4',
      Time:'2023-03-01 12:00:00',
      FillAmount:'1000',
      EquivalentToken:'USDT',
      Deposited:'1000',
      TxHash:'0x1234567890',
      Status:'Success',
      Action:'View'
    },
    {
      key:'5',
      Time:'2023-03-01 12:00:00',
      FillAmount:'1000',
      EquivalentToken:'USDT',
      Deposited:'1000',
      TxHash:'0x1234567890',
      Status:'Success',
      Action:'View'
    },
    {
      key:'6',
      Time:'2023-03-01 12:00:00',
      FillAmount:'1000',
      EquivalentToken:'USDT',
      Deposited:'1000',
      TxHash:'0x1234567890',
      Status:'Success',
      Action:'View'
    }
  ]
  const column=[
    {
      title:'Time',
      dataIndex:'Time',
      key:'time'
    },
    {
      title:"FILLAMOUNT",
      dataIndex:'FillAmount',
      key:'fillAmount'
    },
    {
      title:"EQUIVALENT TOKEN",
      dataIndex:"EquivalentToken",
      key:'equivalentToken'
    },
    {
      title:"DEPOSITED",
      dataIndex:'Deposited',
      key:'deposited'
    },
    {
      title:"TX.HASH",
      dataIndex:'TxHash',
      key:'txHash'
    },
    {
      title:"STATUS",
      dataIndex:"Status",
      key:'status'
    },
    {
      title:"ACTION",
      dataIndex:'Action',
      key:'action'
    }
  ]


  const moreHistory=()=>{
    setLoading(true)
    setTimeout(() => {
      setOrderList([...orderList,...mockOrderList])
      setLoading(false)
    }, 1000);
  }

  
  useEffect(()=>{
    setOrderList(mockOrderList)
  },[])
  return (
    <div className="order-history">
      <div className="order-history-header">
        <span className="order-history-title">{t("limit.orders history")}</span>
        <div className="order-history-header-right">
          <span className="my-posted-order">{t("limit.my post")}</span>
          <>
            <p>{t("limit.only me")}</p>
            <Switch />
          </>
        </div>
      </div>
      <div className="order-history-content">
        
        <Table
          rootClassName="order-history-table"
          dataSource={orderList}
          columns={column}
          pagination={false}
          // scroll={{ y: 200 }}
          // pagination={{ pageSize: 10 }}
          // onScroll={(e) => {
          //   handleScroll(e)
          // }}
          // footer={() => (loading ? <Spin /> : null)}
        />
        { loading ? 
          <Spin />
          :(
            <div className="more-history-container">
            <span className="more-history" onClick={() => {moreHistory()}}>{t("limit.more history")}</span>
            <div className="more-icon"  onClick={() => {moreHistory()}}></div>
          </div>
        )
        }
        
        {/* <div className="order-history-content-header">
          <span>Time</span>
          <span>FILLAMOUNT</span>
          <span>EQUIVALENT TOKEN</span>
          <span>DEPOSITED</span>
          <span>TX.HASH</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div> */}
        <div className="order-history-content-body">



          {/* {
            mockOrderList.map((item)=>(
              <div className="order-history-content-body-item">
                <span>{item.Time}</span>
                <span>{item.FillAmount}</span>
                <span>{item.EquivalentToken}</span>
                <span>{item.Deposited}</span>
                <span>{item.TxHash}</span>
                <span>{item.Status}</span>
                <span>{item.Action}</span>
              </div>
            ))
          } */}
        </div>
      </div>

    </div>
  )
}
export default OrderHistory