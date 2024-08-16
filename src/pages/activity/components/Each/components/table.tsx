import { Table } from 'antd';
import { simplify } from '@/../utils/change.ts';
import { CountContext } from '@/Layout.tsx';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
export default function table({ rankList, isRankList }) {
  const { browser }: any = useContext(CountContext);
  const { t } = useTranslation();
  const columns = [
    {
      title: t('Active.ra'),
      render: (_: null, record: any) => {
        return <span>{record?.rank}</span>;
      },
    },
    {
      title: t('Active.us'),
      render: (_: any, record: any) => {
        return (
          <span>{browser ? record?.userName : simplify(record?.userName)}</span>
        );
      },
    },
    {
      title: t('Active.po'),
      render: (_: any, record: any) => {
        return <span>{record?.views || '0'}</span>;
      },
    },
  ];
  return (
    <Table
      columns={columns}
      rowKey={(record: any) => record?.userName}
      className={'activeTable'}
      pagination={false}
      dataSource={rankList}
      loading={isRankList}
      bordered
    />
  );
}
