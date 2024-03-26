import {motion} from 'framer-motion';
import {useEffect, useState} from 'react'

function Index({name}: any) {
    const [clickAnimate, setClickAnimate] = useState(false);
    useEffect(() => {
        if (clickAnimate) {
            setTimeout(() => {
                setClickAnimate(false)
            }, 1000);

        }
    }, [clickAnimate])
    const animationVariants = {
        hidden: {y: '100%', opacity: 0},
        visible: {y: '-100%', opacity: 1},
    };
    return (
        <div className={'tweetsBox'}>
            {/*  top*/}
            <div className={`dis`}>
                {/* left*/}
                <div className={'tweetsLeft'}>
                    <img src={name?.user?.avatar ? name?.user?.avatar : "/logo.svg"} alt=""
                         style={{width: '40px', marginRight: '7%',borderRadius:'50%'}}/>
                    <p>
                        <span>{name?.user?.username ? name?.user?.username.length > 15 ? name?.user?.username.slice(0, 5) + '...' + name?.user?.username.slice(-4) : name?.user?.username : 'Not yet registor'}</span>
                        <span>{name?.user?.address ? name?.user.address.slice(0, 5) + '...' + name?.user.address.slice(-4) : ''}</span>
                    </p>
                </div>
                <div className={'tweetsFollow'}>
                    <p>1112 Follow</p>
                    <p className={'tweetsRight'}>Follow</p>
                </div>
            </div>
            {/*    text*/}
            <p className={'tweetsText'}>{name?.content ? name.content : ''}</p>
            <img src={name?.imageList?.length > 0 ? name?.imageList[0] : "/swiper.svg"} alt=""
                 style={{width: '100%', borderRadius: '5px', display: 'block'}}/>
            {/*   标识*/}
            <div className={'tweetsMark'}>
                <p>#btc</p>
                <p>#eth</p>
            </div>
            <div className={'tweetsOperate'}>
                <p className={'tweetsIn'}>
                    <img src="/comment.svg" alt=""/>
                    <span>{name?.commentNum ? name.commentNum : 0}</span>
                </p>
                <div className={'tweetsIn'} onClick={() => setClickAnimate(true)}>
                    <img src={name?.likeStatus ? '/loveClick.svg' : "/love.svg"} alt=""/>
                    <span>{name?.likeNum ? name.likeNum : 0}</span>
                    <motion.div
                        initial="hidden"
                        className={`tweetsLick`}
                        animate={!clickAnimate ? 'hidden' : 'visible'}
                        variants={animationVariants}
                        exit="hidden"
                        transition={{duration: 1, ease: 'easeInOut'}}>
                        <span style={{color: 'rgb(0,170,255)'}}>+1500</span>
                    </motion.div>
                </div>
                <p className={'tweetsIn'}>
                    <img src="/share. " alt=""/>
                    <span>111</span>
                </p>
                <p className={'tweetsIn'}>
                    <img src="/look.svg" alt=""/>
                    <span>111</span>
                </p>
            </div>
        </div>
    );
}

export default Index;