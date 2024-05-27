import './index.less'
import Left from './components/left.tsx'
import Center from './components/center.tsx'
import CommunityRight from "../community/components/RightSider.tsx";
import {useContext,} from "react";
import {CountContext} from "../../Layout.tsx";
function Index() {
    
    const {browser}: any = useContext(CountContext);
    return (
        <div className={'box'}>
            {
                browser && <Left/>
            }
            <Center/>
            {
                browser && <div className={`community-page-right scrollStyle`}>
                    <CommunityRight/>
                </div>
            }
        </div>
    );
}

export default Index;