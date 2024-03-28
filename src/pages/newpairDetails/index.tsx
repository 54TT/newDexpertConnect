import Left from './compontent/left.tsx'
import Center from './compontent/center.tsx'
import Right from './compontent/right.tsx'
import './compontent/all.less'
function Index() {
    return (
        <div className={'NewpairDetails'}>
            <Left />
            <Center/>
            <Right/>
        </div>
    );
}

export default Index;