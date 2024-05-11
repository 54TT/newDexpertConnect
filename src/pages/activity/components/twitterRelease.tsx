import './index.less'
function TwitterRelease({openLink, setValue, Confirm,handleCancel}: any) {
    const change = (e: any) => {
        setValue(e.target.value)
    }
    return (
        <div className={'twitterTask'}>
            <p className={'title'}>Step 1</p>
            <p className={'title1'}>Please click "Tweet" and post it.</p>
            <p className={'link'} onClick={openLink}><img src="/x.svg" alt=""/> <span>Tweet</span></p>
            <img src="/twitterCase.png" alt="" style={{width: '30%', display: 'block'}}/>
            <p className={'title'}>Step 2</p>
            <p className={'title1'}>After posting the tweet, pleae click the 'Share' button. Then, click 'Copy link',
                and paste
                the link below to verify.</p>
            <p className={'Paste'}>Paste the link here:</p>
            <input onChange={change}/>
            <img src="/tweet2.png" alt="" style={{width: '70%', display: 'block'}}/>
            <div className={'bot'}>
                <p onClick={handleCancel}>Cancel</p>
                <p onClick={Confirm}>Confirm</p>
            </div>
        </div>
    );
}

export default TwitterRelease;