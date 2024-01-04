// Use 'mysql2' for promise-based MySQL library
const mysql = require('mysql2/promise');

// db connection
const pool = require('./src/config/config');
// require file with starter function
const actions = require("./src/lib/actionFunctions.js");

// Add start to app inside try/catch
const init = async () => {
    console.log('Welcome to the Employee Tracker app!\n To get started, select an action from the list below.\n If you do not have the information readily available, you can leave it blank and update later.');
    try {
        const connection = await pool.getConnection(); // Use await inside an async function
        await actions.start();
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.log(err);
    }
}

// connect to the mysql server and sql database
init();
