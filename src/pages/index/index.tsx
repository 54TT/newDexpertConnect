import { useContext } from "react";
import Right from "./components/right.tsx";
import { CountContext, } from "../../Layout.tsx";
import Left from './components/left.tsx';
function Index() {
    const { browser, }: any = useContext(CountContext);

    const at = async () => {
        // const t = window?.solana?.isBackpack
        // const ta = window?.solana?.isPhantom
        // console.log(t)
        // console.log(ta)
        // try {
        //     const tt = await window?.solana?.connect()
        //     console.log(tt)
        //     const yy = tt.publicKey.toString()
        //     console.log(yy)
        // } catch (e) {
        //     console.log(e)
        // }
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 1%',
            flexDirection: browser ? 'row' : 'column'
        }}>
            <p onClick={at} style={{ display: 'none' }}>nihao</p>
            <Left />
            <Right />
        </div>
    );
}

export default Index;