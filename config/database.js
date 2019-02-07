const mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 20, //important
    host     : 'localhost',
    user     : 'root',
    password : '2015',
    database : 'torritdb1',
    debug    :  false
});


module.exports =pool;
