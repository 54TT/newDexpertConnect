import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    user: process.env.MYSQLUSER,
    host: process.env.MYSQLHOST,
    database: process.env.MYSQLDATABASE,
    password: process.env.MYSQLPASSWORD,
    port: parseInt(process.env.MYSQLPORT || '3306', 10),
  });

export default pool;
