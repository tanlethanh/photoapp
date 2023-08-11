const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: '1234',
    // database: 'photoappdb',
    password: '0000',
    database: 'csc317db',
    connectionLimit: 50,
    debug: false
});

const promisePool = pool.promise();
module.exports = promisePool;
