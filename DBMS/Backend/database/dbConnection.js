import mysql from "mysql"

export const checkConnection=async()=>{
    try {
        
        const db = mysql.createConnection({
            host: "localhost",
            port:'33066', // adil has change his port having some issue in connecting with default "3306" port
            user: "root", 
            password: "12345",   //put your pw here
            database: "event_management_system"
        });
        db.connect((error)=>{
            error? console.log(error):console.log("db is Connected!!")
        });
    } catch (error) {
        
    }
 

}

 