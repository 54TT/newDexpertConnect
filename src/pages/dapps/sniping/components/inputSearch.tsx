import {Input} from 'antd'
export default function inputSearch({enter,searchChange,clickSearch,placeholder}:any) {
  return (
    <Input
    size="large"
    rootClassName="snipingInput"
    onKeyDown={enter}
    placeholder={ placeholder}
    allowClear
    onChange={searchChange}
    suffix={
      <img src="/searchToken.svg" alt=""  style={{
        cursor: 'pointer',
      }}  onClick={clickSearch}/>
    }
  />
  )
}
