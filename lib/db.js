var mysql = require('mysql2');
var db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '11111111',
    database: 'opentutorials'
  });
  db.connect();
  module.exports = db;