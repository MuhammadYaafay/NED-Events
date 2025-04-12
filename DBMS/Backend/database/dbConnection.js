import mysql from "mysql"

const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "sufia123",
    database: "event_management_system"
});

export default db;  