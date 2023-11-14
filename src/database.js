import { createPool } from "mysql2/promise";

let pool;

try {
  pool = createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "gym",
  });
  console.log("Conexión a la base de datos establecida");
} catch (error) {
  console.error("Error al establecer la conexión a la base de datos:", error);
}

export default pool;
