import {ethers} from "ethers";
import {rpcLink} from './judgeStablecoin.ts'
export const getGas = async (chain:string) => {
    const provider = new ethers.JsonRpcProvider(rpcLink[chain])
    const gasAVGPrice = await provider.send('eth_gasPrice', [])
    const gasAVGPriceInWei = parseInt(gasAVGPrice, 16)
    if (gasAVGPriceInWei) {
        const abc = Number(gasAVGPriceInWei) / (10 ** 9)
        return abc.toFixed(2).replace(/\.?0*$/, '')
    }
}