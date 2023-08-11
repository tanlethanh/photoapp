const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 50,
    debug: false
});

const promisePool = pool.promise();
module.exports = promisePool;
