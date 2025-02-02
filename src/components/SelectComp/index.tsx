import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import './index.less';
import { DownOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

export interface SelectCompItemType {
  key: string;
  title: string | React.ReactNode;
  label?: string | React.ReactNode;
}

interface SelectCompType {
  list: SelectCompItemType[];
  data: string;
  onChange: (v: string) => void;
}

function SelectComp({ list, data, onChange }: SelectCompType) {
  const RenderItem = useCallback(() => {
    const selectedItem = list.find((item) => item.key === data);
    // @ts-ignore
    return selectedItem?.title ?? <>-</>;
  }, [data, list]);

  const onDropdownItemChange: MenuProps['onClick'] = ({ key }) => {
    if (data === key) return;
    onChange(key);
  };

  return (
    <Dropdown
      className="drop-down-select"
      overlayClassName="drop-down-overlay"
      trigger={['click']}
      // @ts-ignore
      menu={{ items: list, onClick: onDropdownItemChange }}
    >
      <a
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <RenderItem />
        {list?.length && list.length > 1 ? <DownOutlined /> : <></>}
      </a>
    </Dropdown>
  );
}

export default SelectComp;
