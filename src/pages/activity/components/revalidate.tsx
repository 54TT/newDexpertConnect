import {useTranslation} from "react-i18next";
function Revalidate({select,openLink}: any) {
    const {t} = useTranslation();
    return (
        <div className={'revalidate'}>
            <p>{select?.includes('Twitter') ? t('Dpass.twi') : select?.includes('Telegram') ? t('Dpass.tel') : select?.includes('Discord') ? t('Dpass.dis') : t('Dpass.ins')}:</p>
            <div>
                <div>
                    <img src="/img_3.png" alt="" onClick={openLink}/>
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
                    onClick={openLink}/>
            </div>
            <p onClick={openLink} className="disCen">
                <img
                    src={select?.includes('Twitter') ? "/x.svg" : select?.includes('Telegram') ? '/telegram1.svg' : select?.includes('Discord') ? '/discord.svg' : '/instagram1.svg'}
                    alt=""/>
                <span>{select === 0 ? 'Follow @Dexpertofficial' : select === 1 ? 'Join @DexpertCommunity' : 'Join @Dexpert'}</span>
                {/*<p>{select?.includes('Twitter') ? '@DexpertOfficial' : select?.includes('Telegram') ? '@DexpertCommunity' : select?.includes('Discord') ? '@Dexpert' : ''}</p>*/}
            </p>


        </div>
    );
}

export default Revalidate;