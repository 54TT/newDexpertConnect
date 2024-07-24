import pool from './mysqlDatabase';
import { Order } from './types/order';
import { ORDER_STATUS } from '../entities'

async function createOrder(order: Order): Promise<boolean> {
    const insertQuery = `
      INSERT INTO \`order\` (
        order_hash, chain_id, offerer, filler, order_status, nonce,
        created_at, updated_at, filler_at, order_type, side, input, outputs,
        signature, reactor, encoded_order, deadline, decay_end_time, decay_start_time, input_token,
        input_token_name, input_token_symbol, order_price, input_token_decimals, output_token,
        output_token_name, output_token_symbol, output_token_decimals
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
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

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction
        const [result] = await connection.query(insertQuery, values);
        await connection.commit(); // Commit transaction
        return (result as any[])[0]?.affectedRows === 1;
    } catch (err) {
        await connection.rollback(); // Rollback transaction
        return false;
    } finally {
        connection.release();
    }
}

async function getOrderByOrderHash(orderHash: string) {
    const query = 'SELECT * FROM `order` WHERE order_hash = ?';
    const values = [orderHash];

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(query, values);
        return rows;
    } finally {
        connection.release();
    }
}

async function fillOrder(orderHash: string, filler: string) {
    const currentTime = Math.round(new Date().getTime() / 1000);
    const updateQuery = 'UPDATE `order` SET filler = ?, filler_at = ?, order_status = ?, updated_at = ? WHERE order_hash = ?';
    const values = [filler, currentTime, ORDER_STATUS.FILLED, currentTime, orderHash];

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction
        await connection.query(updateQuery, values);
        await connection.commit(); // Commit transaction
    } catch (err) {
        await connection.rollback(); // Rollback transaction
        throw err;
    } finally {
        connection.release();
    }
}

async function cancelOrder(orderHash: string) {
    const currentTime = Math.round(new Date().getTime() / 1000);
    const updateQuery = 'UPDATE `order` SET order_status = ?, updated_at = ? WHERE order_hash = ?';
    const values = [ORDER_STATUS.CANCELLED, currentTime, orderHash];

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction
        await connection.query(updateQuery, values);
        await connection.commit(); // Commit transaction
    } catch (err) {
        await connection.rollback(); // Rollback transaction
        throw err;
    } finally {
        connection.release();
    }
}

async function updateOrderStatus(orderId: number, updatedData: any) {
    const updateQuery = 'UPDATE `order` SET column1 = ?, column2 = ? WHERE id = ?';
    const values = [updatedData.value1, updatedData.value2, orderId];

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction
        await connection.query(updateQuery, values);
        await connection.commit(); // Commit transaction
    } catch (err) {
        await connection.rollback(); // Rollback transaction
        throw err;
    } finally {
        connection.release();
    }
}

async function queryOrders() {
    const sql = 'SELECT * FROM `order` ORDER BY created_at DESC';
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(sql);
        return rows;
    } finally {
        connection.release();
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