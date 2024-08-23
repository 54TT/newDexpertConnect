import { Popconfirm, Segmented, Select, Slider } from 'antd';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import './index.less';
import { CloseOutlined } from '@ant-design/icons';
import ProInputNumber from '@/components/ProInputNumber';
import { useTranslation } from 'react-i18next';
interface AdvConfigProps {
  onClose: (data: AdvConfigType) => void;
  initData: AdvConfigType;
}
// 高级设置
function AdvConfig({ onClose, initData }: AdvConfigProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<SettingContentRef>();
  const { t } = useTranslation();
  const Title = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <span className="popup-title">{t('Slider.Advanced setting')}</span>
      <CloseOutlined
        style={{ color: '#fff', cursor: 'pointer', padding: '4px' }}
        onClick={() => {
          const data = contentRef.current?.getData();
          onClose?.(data!);
          setOpen(false);
        }}
      />
    </div>
  );
  return (
    <Popconfirm
      overlayClassName="adv-config-pop"
      title={<Title />}
      open={open}
      placement="bottomRight"
      icon={null}
      description={<SettingContent initData={initData} ref={contentRef} />}
    >
      <img
        className="dappSwapImg"
        src="/setting.svg"
        alt=""
        onClick={() => setOpen(true)}
      />
    </Popconfirm>
  );
}

export interface TradeDeadlineType {
  uint: 'h' | 'm';
  value: any;
}

interface SettingContentRef {
  getData: () => AdvConfigType;
}

export interface AdvConfigType {
  slipType: '0' | '1';
  slip: any;
  tradeDeadline: TradeDeadlineType;
}

export const SettingContent: ForwardRefExoticComponent<
  { initData: AdvConfigType } & RefAttributes<SettingContentRef>
> = forwardRef(({ initData }, ref) => {
  const { t } = useTranslation();
  const segmentOptions = [
    {
      label: t('Slider.Auto'),
      value: '0',
    },
    {
      label: t('Slider.Customize'),
      value: '1',
    },
  ];
  const selectOptions = [
    {
      label: t('Slider.Min'),
      value: 'm',
    },
    {
      label: t('Slider.Hour'),
      value: 'h',
    },
  ];
  const [slipType, setSlipType] = useState(initData.slipType);
  const [slip, setSlip] = useState<any>(initData.slip);
  const [tradeDeadline, setTradeDeadline] = useState<TradeDeadlineType>(
    initData.tradeDeadline
  );

  useImperativeHandle(ref, () => ({
    getData: () => ({
      slipType,
      slip,
      tradeDeadline,
    }),
  }));

  return (
    <div className="setting-content">
      <div className="setting-item">
        <span>{t('Slider.Maximum')}</span>
        <Segmented
          options={segmentOptions}
          onChange={(v: '0' | '1') => setSlipType(v)}
        />
      </div>
      {slipType === '1' && (
        <div className="setting-item">
          <span>Custom Slip</span>
          <Slider
            className="adv-slider"
            /*             style={{ width: '100px' }} */
            value={slip}
            step={0.01}
            min={0}
            max={0.5}
            onChange={(v) => setSlip(v)}
          />
          <div className="setting-item-back">
            <ProInputNumber
              inputNumberProps={{ step: 0.01, min: 0, max: 0.5 }}
              value={slip}
              onChange={(v) => setSlip(v || 0)}
            />
          </div>
        </div>
      )}
      <div className="setting-item">
        <span>{t('Slider.Order')}</span>

        <div className="setting-item-back">
          <ProInputNumber
            inputNumberProps={{ min: 5 }}
            value={tradeDeadline.value}
            onChange={(v) => {
              setTradeDeadline({
                ...tradeDeadline,
                value: v || 0,
              });
            }}
          />
          <Select
            options={selectOptions}
            value={tradeDeadline.uint}
            onChange={(v) => {
              setTradeDeadline({
                ...tradeDeadline,
                uint: v,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default AdvConfig;
