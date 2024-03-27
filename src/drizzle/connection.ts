import mysql, { ConnectionOptions } from "mysql2/promise";
import "@/lib/load_env";

export const connectionConfig: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "3306"),
    database: process.env.DB_DATABASE ?? "",
    user: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
};

export const connection = () => {
    return mysql.createPool(connectionConfig);
};

// connection().getConnection().then((conn) => {
//     console.log("Database connected");

//     // return the connection to the pool, so it can be used by other parts of the app
//     conn.release();
// }).catch((err) => {
//     console.error("Database connection error", err);
// });

export default connection;
