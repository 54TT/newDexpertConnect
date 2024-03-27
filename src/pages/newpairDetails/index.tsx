import Left from './compontent/left.tsx'

function Index() {
    return (
        <div className={'NewpairDetails'}>
            <Left />
            <div style={{flex: 1, border: '1px solid green', height: '100px'}}></div>
            <div style={{width: '20%', border: '1px solid gray', height: '100px'}}></div>
        </div>
    );
}

export default Index;