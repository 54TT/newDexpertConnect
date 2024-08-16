import './index.less'
import React,{ useContext, } from "react";
const Left = React.lazy(() => import('./components/left.tsx'));
const Center = React.lazy(() => import('./components/center.tsx'));
const CommunityRight = React.lazy(() => import('../community/components/RightSider.tsx'));
import { CountContext } from "@/Layout.tsx";
function Index() {
    const { browser }: any = useContext(CountContext);
    return (
        <div className={'box'}>
            {
                browser && <Left />
            }
            <Center />
            {
                browser && <div className={`community-page-right`} style={{ width: browser ? '80%' : '80%' }}>
                    <CommunityRight isShow={true} />
                </div>
            }
        </div>
    );
}

export default Index;