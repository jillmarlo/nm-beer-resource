var express = require('express');
var router = express.Router();

function getBreweries(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name FROM brewery", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.brewery  = results;
        complete();
    });
}

function getBeers(params, res, mysql, context, complete){
    var query = "SELECT b.id, b.name, brewery.name AS brewery, style.name AS style, b.ba_rating, b.awards FROM beer b " +
        "LEFT JOIN brewery ON b.brewery_id=brewery.id " +
        "LEFT JOIN style ON b.style_id=style.id";
    var inserts = [];

    if (params.flavor_id) {
        query = query + " INNER JOIN beer_flavor ON b.id = beer_flavor.bid WHERE beer_flavor.fid = ?";
        inserts.push(params.flavor_id);
    }

    mysql.pool.query(query, inserts, function(error, results, fields){
        if(error){
            console.log(error);
            res.write(JSON.stringify(error));
            res.end();
        }
        context.beers = results;
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

function getBeer(res, mysql, context, id, complete){
    var sql = "SELECT b.id AS id, b.name, b.ba_rating, b.awards, brewery.name AS brewery, style.name AS style FROM beer b " +
        "LEFT JOIN brewery on b.brewery_id=brewery.id " +
        "LEFT JOIN style on b.style_id=style.id WHERE b.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.beers = results[0];
        complete();
    });
}

function getFlavorForBeer(mysql, beer_id, context, complete) {
    var sql = "SELECT fid FROM beer_flavor WHERE bid = ?";
    var inserts = [parseInt(beer_id)];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        console.log(results);
        if(error){
            console.log(error);
        }
        else {
            context.beerFlavors = results.map(function(item) {
                return item.fid;
            });
            if (!Array.isArray(context.beerFlavors)) context.beerFlavors = [ context.beerFlavors ];
            complete();
        }
    });
}

router.get('/', function(req, res){
    var params = {};

    if (req.query && req.query.flavor_id) {
        params.flavor_id = req.query.flavor_id;
    }

    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getBreweries(res, mysql, context, complete);
    getBeers(params, res, mysql, context, complete);
    getStyle(res, mysql, context, complete);
    getFlavor(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 4){
            res.render('beers', context);
        }

    }
});

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO beer (name, brewery_id, style_id, ba_rating, awards) VALUES (?,?,?,?,?)";
    var inserts = [req.body.name, req.body.brewery_id, req.body.style_id, req.body.ba_rating, req.body.awards];
    mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            if (req.body.flavor_ids) {
                var id = results.insertId;
                var flavor_id_param = req.body.flavor_ids;
                if (!Array.isArray(flavor_id_param)) flavor_id_param = [ flavor_id_param ];
                flavor_id_param = flavor_id_param.map(function(item) {
                    return [id, item];
                });
                createBeerFlavor(mysql, flavor_id_param, function() {
                    res.redirect('/beers');
                });
            }
            else {
                res.redirect('/beers');
            }
        }
    });
});

router.get('/:id', function(req, res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getBeer(res, mysql, context, req.params.id, complete);
    getBreweries(res, mysql, context, complete);
    getStyle(res, mysql, context, complete);
    getFlavor(res, mysql, context, complete);
    getFlavorForBeer(mysql, req.params.id, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 5){
            res.render('update-beer', context);
        }

    }
});

router.put('/:id', function(req, res){
    console.log(req.body.flavor_ids);
    var flavor_id_param = req.body.flavor_ids;
    if (!Array.isArray(flavor_id_param)) flavor_id_param = [ flavor_id_param ];
    var flavor_ids = flavor_id_param.map(function(fid) {
        return [parseInt(req.params.id), parseInt(fid)];
    });
    var mysql = req.app.get('mysql');
    updateBeerFlavor(mysql, req.params.id, flavor_ids, function() {
        var sql = "UPDATE beer SET name=?, brewery_id=?, style_id=?, ba_rating=?, awards=? WHERE id=?";
        console.log(req.body);
        var inserts = [req.body.name, req.body.brewery_id, req.body.style_id, req.body.ba_rating, req.body.awards, req.params.id];
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
});

router.delete('/:id', function(req, res){
    console.log('in delete');
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM beer WHERE id = ?";
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

function updateBeerFlavor(mysql, beer_id, flavor_ids, complete) {
    var query = "DELETE from beer_flavor WHERE bid = ?";
    var inserts = [beer_id];
    mysql.pool.query(query, inserts, function(error, results, fields){
        console.log(results);
        if(error){
            console.log(error);
        }else{
            createBeerFlavor(mysql, flavor_ids, function() {
                complete();
            });
        }
    })
}

function createBeerFlavor(mysql, flavor_ids, complete) {
    mysql.pool.query("INSERT INTO beer_flavor (bid, fid) VALUES ?", [flavor_ids], function(error, results, fields) {
        if (error) {
            console.log(error)
        }
        else {
            complete();
        }
    });
}

module.exports = router;