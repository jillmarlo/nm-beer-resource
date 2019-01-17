var express = require('express');
var router = express.Router();


function getFlavor(res, mysql, context, complete){
    mysql.pool.query("SELECT id, descriptor FROM flavor", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.flavor = results;
        complete();
    });
}

function getAflavor(res, mysql, context, id, complete){
    var sql = "SELECT id, descriptor FROM flavor WHERE id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.flavor = results[0];
        complete();
    });
}

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getFlavor(res, mysql, context, complete);
    function complete(){
        console.log(' in complete', callbackCount);
        callbackCount++;
        if(callbackCount >= 1){
            res.render('flavor', context);
        }

    }
});

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO flavor (descriptor) VALUES (?)";
    var inserts = [req.body.descriptor];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/flavor');
        }
    });
});

router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getAflavor(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('update-flavor', context);
        }
    }
});

router.put('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE flavor SET descriptor=? WHERE id=?";
    var inserts = [req.body.descriptor, req.params.id];
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
    var sql = "DELETE FROM flavor WHERE id = ?";
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