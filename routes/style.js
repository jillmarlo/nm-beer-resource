var express = require('express');
var router = express.Router();


function getStyle(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name FROM style", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.style  = results;
        complete();
    });
}

function getAstyle(res, mysql, context, id, complete){
    var sql = "SELECT id, name FROM style WHERE id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.style = results[0];
        complete();
    });
}

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getStyle(res, mysql, context, complete);
    function complete(){
        console.log(' in complete', callbackCount);
        callbackCount++;
        if(callbackCount >= 1){
            res.render('style', context);
        }

    }
});

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO style (name) VALUES (?)";
    var inserts = [req.body.name];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/style');
        }
    });
});

router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {};
    //context.jsscripts = ["selectedplanet.js", "updateperson.js"];
    var mysql = req.app.get('mysql');
    getAstyle(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('update-style', context);
        }
    }
});

router.put('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE style SET name=? WHERE id=?";
    var inserts = [req.body.name, req.params.id];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
    });
});

router.delete('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM style WHERE id = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
})

module.exports = router;