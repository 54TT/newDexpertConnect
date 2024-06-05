import { useContext } from "react";
import Right from "./components/right.tsx";
import { CountContext, } from "../../Layout.tsx";
import Left from './components/left.tsx';
function Index() {
    const { browser,  }: any = useContext(CountContext);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 2%',
            flexDirection: browser ? 'row' : 'column'
        }}>
            <Left />
            <Right />
        </div>
    );
}

export default Index;