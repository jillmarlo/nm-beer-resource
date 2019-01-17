var express = require('express');
var router = express.Router();

function getBreweries(res, mysql, context, complete){
    mysql.pool.query("SELECT brew.id, brew.name, brew.location, style.name AS brewery_style, brew.kitchen FROM brewery brew " +
        "LEFT JOIN style ON brew.style_id=style.id"
        , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.brewery  = results;
        complete();
    });
}

function getBrewery(res, mysql, context, id, complete){
    var sql = "SELECT brew.id, brew.name, brew.location, style.name as brewery_style, brew.kitchen FROM brewery brew " +
        "LEFT JOIN style ON style.id=brew.style_id WHERE brew.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.brewery = results[0];
        complete();
    });
}

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

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getBreweries(res, mysql, context, complete);
    getStyle(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('brewery', context);
        }

    }
});

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO brewery (name, location, style_id, kitchen) VALUES (?,?,?,?)";
    var inserts = [req.body.name, req.body.location, req.body.style_id, req.body.kitchen];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/brewery');
        }
    });
});

router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {};
    //context.jsscripts = ["selectedplanet.js", "updateperson.js"];
    var mysql = req.app.get('mysql');
    getBrewery(res, mysql, context, req.params.id, complete);
    getStyle(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('update-brewery', context);
        }

    }
});

router.put('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE brewery SET name=?, location=?, style_id=?, kitchen=? WHERE id=?";
    var inserts = [req.body.name, req.body.location, req.body.style_id, req.body.kitchen, req.params.id];
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
    var sql = "DELETE FROM brewery WHERE id = ?";
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        console.log(results);
        if(error){
            console.log(error);
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
})

module.exports = router;