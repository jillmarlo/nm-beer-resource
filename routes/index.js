var express = require('express');
var router = express.Router();


function toBeers() {
    console.log('in tobeers');
    res.render('beers', { title: 'Beers' });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('in root');
    const context = { title: 'New Mexico Beer Catalog' };
  res.render('index', context);
});

module.exports = router;
