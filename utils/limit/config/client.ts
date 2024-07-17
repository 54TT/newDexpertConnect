// src/db/query.ts

import pool from '../config/database';
import { Order } from './types/order';
import { ORDER_STATUS } from '../entities'

async function createOrder(order: Order): Promise<boolean> {
    const insertQuery = `
      INSERT INTO "public"."order" (
        order_hash, chain_id, offerer, filler, order_status, nonce,
        created_at, updated_at, filler_at, order_type, side, input, outputs,
        signature, reactor, encoded_order, deadline, decay_end_time, decay_start_time,input_token,
        input_token_name, input_token_symbol, order_price, input_token_decimals, output_token,
        output_token_name, output_token_symbol, output_token_decimals
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
      )
    `;

    const values = [
        order.orderHash, order.chainId, order.offerer, order.filler, order.orderStatus, order.nonce,
        order.createdAt || new Date(), order.updatedAt || new Date(), order.fillerAt, order.orderType,
        order.side, order.input, order.outputs, order.signature, order.reactor, order.encodedOrder,
        order.deadline, order.decayEndTime, order.decayStartTime,
        order.inputToken, order.inputTokenName, order.inputTokenSymbol, order.orderPrice, order.inputTokenDecimals,
        order.outputToken, order.outputTokenName, order.outputTokenSymbol, order.outputTokenDecimals
    ];

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // 开始事务
        const result = await client.query(insertQuery, values);
        await client.query('COMMIT'); // 提交事务
        return result.rowCount === 1; // 检查受影响的行数
    } catch (err) {
        await client.query('ROLLBACK'); // 回滚事务
        console.log("err:", err)
        return false;
    } finally {
        client.release();
    }
}

async function getOrderByOrderHash(orderHash: string) {
    const query = 'SELECT * FROM orders WHERE order_hash = $1';
    const values = [orderHash];

    const client = await pool.connect();
    try {
        const result = await client.query(query, values);
        return result.rows;
    } finally {
        client.release();
    }
}

async function fillOrder(orderHash: string, filler: string) {
    const currentTime = Math.round(new Date().getTime() / 1000)
    const updateQuery = 'UPDATE orders SET filler = $1, filler_at = $2, order_status = $3, update_at = $4 WHERE order_hash = $5';
    const values = [filler, currentTime, ORDER_STATUS.FILLED, currentTime, orderHash];

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // 开始事务
        await client.query(updateQuery, values);
        await client.query('COMMIT'); // 提交事务
    } catch (err) {
        await client.query('ROLLBACK'); // 回滚事务
        throw err;
    } finally {
        client.release();
    }
}

async function cancelOrder(orderHash: string) {
    const currentTime = Math.round(new Date().getTime() / 1000)
    const updateQuery = 'UPDATE orders SET order_status = $1, update_at = $2 WHERE order_hash = $3';
    const values = [ORDER_STATUS.CANCELLED, currentTime, orderHash];

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // 开始事务
        await client.query(updateQuery, values);
        await client.query('COMMIT'); // 提交事务
    } catch (err) {
        await client.query('ROLLBACK'); // 回滚事务
        throw err;
    } finally {
        client.release();
    }
}

async function updateOrderStatus(orderId: number, updatedData: any) {
    const updateQuery = 'UPDATE orders SET column1 = $1, column2 = $2 WHERE id = $3';
    const values = [updatedData.value1, updatedData.value2, orderId];

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // 开始事务
        await client.query(updateQuery, values);
        await client.query('COMMIT'); // 提交事务
    } catch (err) {
        await client.query('ROLLBACK'); // 回滚事务
        throw err;
    } finally {
        client.release();
    }
}

async function queryOrders() {
    const sql = `select * from "public"."order" order by created_at desc`
    const client = await pool.connect();
    try {
        const result = await client.query(sql);
        return result.rows;
    } finally {
        client.release();
    }
}


export {
    createOrder,
    getOrderByOrderHash,
    fillOrder,
    cancelOrder,
    updateOrderStatus,
    queryOrders
}