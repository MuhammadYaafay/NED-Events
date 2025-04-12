import mysql from "mysql"

const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "",   //put your pw here
    database: "event_management_system"
});

export default db;  