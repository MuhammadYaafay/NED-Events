import mysql from "mysql"

const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "sufia123",   //put your pw here
    database: "event_management_system"
});
 
function checkConnection(){
    db.connect((error)=>{
        error? console.log(error):console.log("Connection made!")
    });

}
checkConnection();
export default db;  