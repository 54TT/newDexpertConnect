import './index.less'
import { useTranslation } from "react-i18next";
import Load from '../../../components/allLoad/load'

function TwitterRelease({ openLink, setValue, Confirm, handleCancel, isConfirm }: any) {
    const { t } = useTranslation();
    const change = (e: any) => {
        setValue(e.target.value)
    }
    return (
        <div className={'twitterTask'}>
            <p className={'title'}>{t('Active.Step1')}</p>
            <p className={'title1'}>{t('Active.post')}</p>
            <p className={'link disCen'} onClick={openLink}><img src="/x.svg" alt="" /> <span> {t('Active.Tweet')}</span></p>
            <img src="/twitterCase.png" alt="" style={{ width: '30%', display: 'block' }} />
            <p className={'title'}>  {t('Active.Step2')}</p>
            <p className={'title1'}> {t('Active.After')}</p>
            <p className={'Paste'}>{t('Active.link')} </p>
            <input onChange={change} />
            <img src="/tweet2.png" alt="" style={{ width: '70%', display: 'block' }} />
            <div className={'bot disDis'}>
                <p onClick={handleCancel} className='p'> {t('Active.Cancel')} </p>
                <div onClick={Confirm} className='p'> {t('Active.Confirm')} {isConfirm ? <Load  /> : ''}</div>
            </div>
        </div>
    );
}

export default TwitterRelease;