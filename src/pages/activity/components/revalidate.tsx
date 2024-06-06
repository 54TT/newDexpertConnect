import { useTranslation } from "react-i18next";
function Revalidate({ select, openLink }: any) {
    const { t } = useTranslation();
    return (
        <div className={'revalidate'}>
            <p>{select === '1' ? t('Dpass.twi') : select === '2' ? t('Dpass.tel') : select === '3' ? t('Dpass.dis') : t('Dpass.ins')}:</p>
            <div>
                <div>
                    <img src="/img_3.png" alt="" onClick={openLink} />
                    <div>
                        <p onClick={openLink}>Dexpert</p>
                        <p>{select?.includes('Twitter') ? '@DexpertOfficial' : select?.includes('Telegram') ? '@DexpertCommunity' : select?.includes('Discord') ? '@Dexpert' : ''}---<span
                            onClick={openLink}>{select?.includes('Twitter') || select?.includes('Instagram') ? 'Follow' : 'Join'}</span>
                        </p>
                    </div>
                </div>
                <img
                    src={select?.includes('Twitter') ? "/x.svg" : select?.includes('Telegram') ? '/telegram1.svg' : select?.includes('Discord') ? '/discord.svg' : '/instagram1.svg'}
                    alt=""
                    onClick={openLink} />
            </div>
            <p onClick={openLink} className="disCen">
                <img
                    src={select === '1' ? "/x.svg" : select === '2' ? '/telegram1.svg' : select === '3' ? '/discord.svg' : '/instagram1.svg'}
                    alt="" />
                <span>{select === '1' ? 'Follow @Dexpertofficial' : select === '2' || select === '3' ? 'Join @DexpertCommunity' : 'Follow @Dexpert'}</span>
            </p>
        </div>
    );
}

export default Revalidate;