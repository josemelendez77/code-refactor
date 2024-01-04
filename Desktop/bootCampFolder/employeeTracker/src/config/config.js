// Use 'mysql2' for promise-based MySQL library
const mysql = require('mysql2/promise');

// db connection
const pool = mysql.createPool({
    host: 'your_mysql_host',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'your_mysql_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// require file with starter function
const actions = require("./src/lib/actionFunctions");

// Add start to app inside try/catch
const init = async () => {
    console.log('Welcome to the Employee Tracker app!\n To get started, select an action from the list below.\n If you do not have the information readily available, you can leave it blank and update later.');
    try {
        const connection = await pool.getConnection();
        await actions.start();
        connection.release();
    } catch (err) {
        console.log(err);
    }
}

// connect to the mysql server and sql database
init();
