import { Input } from 'antd';
export default function inputSearch({
  enter,
  searchChange,
  placeholder,
}: any) {

const clickSearch=()=>{
  enter('click')
}
  return (

    <Input
    autoComplete={'off'}
    rootClassName="snipingInput"
    onKeyDown={enter}
    placeholder={placeholder}
    allowClear
    onChange={searchChange}
    suffix={
      <img src="/searchToken.svg" alt=""  style={{
        cursor: 'pointer',
      }}  onClick={clickSearch}/>
    }
  />
  );
}
