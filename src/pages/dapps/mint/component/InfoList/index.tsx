import './index.less';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout';
import { FormDataType } from '../../pages/LaunchFill';
function InfoList({
  data,
  className,
}: {
  data: Partial<FormDataType>;
  className?: string;
}) {
  const { contractConfig } = useContext(CountContext);
  const { t } = useTranslation();
  const {
    name,
    symbol,
    logoLink,
    totalSupply,
    websiteLink,
    telegramLink,
    twitterLink,
    discordLink,
    description,
  } = data;
  return (
    <div className={`info-list mint-scroll ${className}`}>
      <div className="info-list-token info-list-item">
        <img src={logoLink ? logoLink : '/default-edit-icon.png'} alt="" />
        <div className="info-list-token-detail">
          <div className="info-list-symbol">{symbol}</div>
          <div className="info-list-name">{name}</div>
          <div className="info-list-totalSupply">{totalSupply}</div>
        </div>
      </div>
      <div className="info-list-item">
        <img src="/website-launch.svg" alt="" />
        <div>{websiteLink}</div>
      </div>
      <div className="info-list-item">
        <img src="/telegrams.svg" alt="" />
        <div>{telegramLink}</div>
      </div>
      <div className="info-list-item">
        <img src="/twitter.svg" alt="" />
        <div>{twitterLink}</div>
      </div>
      <div className="info-list-item">
        <img src="/discord-launch.svg" alt="" />
        <div>{discordLink}</div>
      </div>
      <div className="info-list-item descript">
        <div className="info-list-item-descript">Describe</div>
        <div>{description}</div>
      </div>
    </div>
  );
}
export default InfoList;
