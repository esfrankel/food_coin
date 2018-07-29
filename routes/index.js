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

  res.render('index', {title: 'FoodCoin'});
});
});

router.get('/verify', function(req, res, next) {
    res.render('verify/index.hbs');
})

router.post('/verify/index', function(req, res, next) {
    var options = { method: 'POST',
      url: 'https://api.globalgateway.io/verifications/v1/verify',
      body:
       { CountryCode: 'US',
         Demo: 'true',
         AcceptTruliooTermsAndConditions: 'true',
         DataFields:
          { PersonInfo:
             { FirstGivenName: 'John',
               MiddleName: 'Henry',
               FirstSurName: 'Smith',
               DayOfBirth: 5,
               MonthOfBirth: 3,
               YearOfBirth: 1983 },
            Communication: { Telephone: '0398968785' } } },
      headers: {
          "Authorization":"Basic VG9tbXlHYW9fQVBJOkFuZ2VsSGFja3NAMTg="
      },
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
    res.render('index');
});

module.exports = router;
