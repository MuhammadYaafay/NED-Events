import mysql from "mysql";

export const checkConnection = async () => {
  try {
    const db = mysql.createConnection({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "797616", //put your pw here
      database: "event_management_system",
    });
    db.connect((error) => {
      error ? console.log(error) : console.log("db is Connected!!");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
