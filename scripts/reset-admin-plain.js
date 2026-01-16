const mariadb = require("mariadb");
const bcrypt = require("bcryptjs");

async function main() {
  const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "", // assuming empty password based on common setups, or update if needed
    database: "bazim_clothing",
    port: 3306,
  });

  // Note: Previous .env showed password might be 'm.h_mughal14'
  // Let's verify that first.
}
