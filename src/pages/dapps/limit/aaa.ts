// import { createOrder, executeOrder } from "./order"
// import { BigNumber, Contract, ethers, Wallet } from 'ethers';
// import { queryOrders } from './config/client';
// import {queryOrders as query2} from './config/mysqlClient'

// const sepoliaProvider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
// const orderCreatorPrivateKey: string = '227e38b12814302308de3d564c27589b934c893f412405364e4bd6fa152d4415';
// const chainId: number = 11155111;
// const orderCreator: Wallet = new Wallet(orderCreatorPrivateKey, sepoliaProvider);
// const orderFiller: Wallet = new Wallet(orderCreatorPrivateKey, sepoliaProvider);

// const receipt: string = "0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89";
// const inputToken: string = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";
// const outputToken: string = "0xb72bc8971d5e595776592e8290be6f31937097c6";
// const deadlineSeconds: number = 24 * 60 * 60; // 1 day in seconds
// const orderAmout: BigNumber = BigNumber.from(1000000);

// async function main(){
//     const createResponse = await createOrder(chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds)
//     console.log("createResponse:",createResponse)
//     // const orders = await queryOrders();
//     // const order = orders[0];
//     // console.log("order:", order)
//     // const output = JSON.parse(order.outputs)[0]
//     // const value: BigNumber = output.token === ethers.constants.AddressZero ? output.startAmount : BigNumber.from(0);
//     // const respon = await executeOrder(chainId, orderFiller, order.encoded_order, order.signature, value)
//     // console.log("respon:",respon)
// }

// main()