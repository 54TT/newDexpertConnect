import { useTranslation } from "react-i18next";

function CommingSoon(hei: any) {
    const {t} = useTranslation()
    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            backgroundColor: 'black',
            opacity: '0.8',
            top: '0',
            color: 'gray',
            textAlign: 'center',
            lineHeight: hei,
            borderRadius:'7px'
        }}>
            {t("Common.Coming soon")}
        </div>
    );
}

export default CommingSoon;