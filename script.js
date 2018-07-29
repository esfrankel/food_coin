var express = require('express');
var router = express.Router();

const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {

  const url = "https://api.globalgateway.io/verifications/v1/verify";
  request.get(url, (err, response, body) => {
    if(err) {console.error(err)}
    body = JSON.parse(body);
    console.log(body);

  res.render('index', {"hi"});
});
});

router.get('/search', (req, res, next) => {
  res.render('search');
})

router.post('/search', (req,res,next) => {
  const query = req.body['giphy-query'];
  const url = `http://api.giphy.com/v1/gifs/search?api_key=skVv5MHiUFjpzCZWGJSUAtH8qkkLPGeM&q=${query}`;

  request.get(url, (err,response,body) => {
    if(err) {console.error(err)}

    body = JSON.parse(body);

    const randomResult=body.data[Math.floor(Math.random()*body.data.length)];
    const searchResultURL=randomResult.images.fixed_height.url;

    res.render('search', {searchResultURL: searchResultURL});
    // res.status(204).send({});
  })


});



module.exports = router;
