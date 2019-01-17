var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'den1.mysql2.gear.host',
    user            : 'nmbeerresource',
    password        : 'Zm0Y939!~QGs',
    database        : 'nmbeerresource'
});
module.exports.pool = pool;