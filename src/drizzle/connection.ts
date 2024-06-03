import mysql, { ConnectionOptions } from "mysql2/promise";
import "@/lib/load_env";

export const connectionConfig: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "3306"),
    database: process.env.DB_DATABASE ?? "",
    user: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
};

export const mysqlPool = mysql.createPool(connectionConfig);

mysqlPool
    .getConnection()
    .then((connection) => {
        // console.log(
        //     `Connection to MySQL established successfully, threadId: ${connection.threadId}`,
        // );
        connection.release();
    })
    .catch((error) => {
        console.error("Error connecting to MySQL", error);
        mysqlPool.end();
        console.error("MySQL connection pool closed due to error");
    });

// mysqlPool.on("release", (connection) => {
//     console.log(`Connection ${connection.threadId}} released`);
// });

export default mysqlPool;
