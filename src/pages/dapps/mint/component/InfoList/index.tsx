import './index.less';
import { useTranslation } from 'react-i18next';
import { FormDataType } from '../../pages/LaunchFill';
function InfoList({
  data,
  className,
}: {
  data: Partial<FormDataType>;
  className?: string;
}) {
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
        <div><span>{websiteLink}</span></div>
      </div>
      <div className="info-list-item">
        <img src="/telegrams.svg" alt="" />
        <div><span>{telegramLink}</span></div>

      </div>
      <div className="info-list-item">
        <img src="/twitter.svg" alt="" />
        <div><span>{twitterLink}</span></div>
      </div>
      <div className="info-list-item">
        <img src="/discord-launch.svg" alt="" />
        <div><span>{discordLink}</span></div>
      </div>
      <div className="info-list-item descript">
        <div className="info-list-item-descript">Description</div>
        <div style={{ overflowWrap: "break-word" }}>{description}</div>
      </div>
    </div>
  );
}
export default InfoList;
