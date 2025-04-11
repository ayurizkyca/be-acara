//untuk buat crypt untuk enkripsi

const crypto = require("crypto");

const SECRET = crypto.randomBytes(16).toString("hex");

console.log(SECRET);