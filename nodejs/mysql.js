var mysql = require('mysql2');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '11111111',
    database: 'opentutorials'
});

connection.connect();

connection.query('SELECT * FROM topic', function (error, results, fields) {
    if(error){
        console.log(error);
    }
    console.log(results);
});

connection.end();