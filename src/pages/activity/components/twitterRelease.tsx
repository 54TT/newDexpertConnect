import './index.less'
import { useTranslation } from "react-i18next";


function TwitterRelease({ openLink, setValue, Confirm, handleCancel }: any) {
    const { t } = useTranslation();
    const change = (e: any) => {
        setValue(e.target.value)
    }
    return (
        <div className={'twitterTask'}>
            <p className={'title'}>{t('Active.Step1')}</p>
            <p className={'title1'}>{t('Active.post')}</p>
            <p className={'link'} onClick={openLink}><img src="/x.svg" alt="" /> <span> {t('Active.Tweet')}</span></p>
            <img src="/twitterCase.png" alt="" style={{ width: '30%', display: 'block' }} />
            <p className={'title'}>  {t('Active.Step2')}</p>
            <p className={'title1'}> {t('Active.After')}</p>
            <p className={'Paste'}>{t('Active.After')} </p>
            <input onChange={change} />
            <img src="/tweet2.png" alt="" style={{ width: '70%', display: 'block' }} />
            <div className={'bot'}>
                <p onClick={handleCancel}> {t('Active.Cancel')} </p>
                <p onClick={Confirm}> {t('Active.Confirm')}</p>
            </div>
        </div>
    );
}

export default TwitterRelease;