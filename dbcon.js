var mysql = require('mysql');
var pool = mysql.createPool({
host : 'classmysql.engr.oregonstate.edu',
user : 'cs290_valdival',
password: '6715',
database: 'cs290_valdival'
});

module.exports.pool = pool;