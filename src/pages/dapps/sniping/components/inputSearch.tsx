import { Input } from 'antd';
export default function inputSearch({
  enter,
  searchChange,
  placeholder,
}: any) {
  return (
    <Input.TextArea
      rootClassName="snipingInput"
      onKeyDown={enter}
      placeholder={placeholder}
      allowClear
      maxLength={100}
      onChange={searchChange}
      autoSize
    />
  );
}
