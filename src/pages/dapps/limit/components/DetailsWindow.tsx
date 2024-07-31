import { useEffect } from "react"


const DetailsWindow=(order)=>{
  
  useEffect(()=>{
    console.log(order)
  },[])
  return (
  <>
    <div className="details-window">
      details-window
    </div>
  </>
  )
}


export default DetailsWindow