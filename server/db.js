// server/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // ganti sesuai config MySQL kamu
  password: "", // biasanya kosong di XAMPP
  database: "ebay_scraper",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Terhubung ke MySQL");
});

module.exports = db;
