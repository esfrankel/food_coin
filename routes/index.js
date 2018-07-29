var express = require('express');
var router = express.Router();

const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {

  const url = "https://api.globalgateway.io/verifications/v1/verify";
  request.get(url, (err, response, body) => {
    if(err) {console.error(err)}
    body = JSON.parse(body);
    console.log(body);

  res.render('index', {title: 'Express'});
});
});

module.exports = router;
