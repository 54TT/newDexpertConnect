import {ethers} from "ethers";

export const getGas = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/BhTc3g2lt1Qj3IagsyOJsH5065ueK1Aw')
    const gasAVGPrice = await provider.send('eth_gasPrice', [])
    const gasAVGPriceInWei = parseInt(gasAVGPrice, 16)
    if (gasAVGPriceInWei) {
        const abc = Number(gasAVGPriceInWei) / (10 ** 9)
        return parseFloat(abc.toFixed(1)).toString()
    }
}