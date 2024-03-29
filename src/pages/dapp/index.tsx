import './index.less'
import Left from './components/left.tsx'
import Center from './components/center.tsx'
import CommunityRight from "../community/components/RightSider.tsx";
function Index() {
    return (
        <div className={'box'}>
            <Left/>
            <Center/>
            <div className={`community-page-right scrollStyle`}>
                <CommunityRight/>
            </div>
        </div>
    );
}

export default Index;