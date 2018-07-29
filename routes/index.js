var express = require('express');
var router = express.Router();
var match = false;
const Web3 = require('web3')

const web3 = new Web3( new Web3.providers.HttpProvider('http://localhost:8545'));

const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'FoodCoin'});
  console.log(web3.eth.accounts);
});

router.get('/verify', function(req, res, next) {
    res.render('verify/index.hbs');
})

router.post('/verify/index', function(req, res, next) {
  let body = req.body;
  console.log(body);
  let first = body.FirstGivenName;
  let mid = body.MiddleName;
  let last = body.FirstSurName;
  let dateBirth = body.DayOfBirth;
  let monthBirth = body.MonthOfBirth;
  let yearBrith = body.YearOfBirth;
  let phoneNum = body.Telephone;

    var options = { method: 'POST',
      url: 'https://api.globalgateway.io/verifications/v1/verify',
      body:
       { CountryCode: 'US',
         AcceptTruliooTermsAndConditions: 'true',
         DataFields:
          { PersonInfo:
             { FirstGivenName: first,
               MiddleName: mid,
               FirstSurName: last,
               DayOfBirth: dateBirth,
               MonthOfBirth: monthBirth,
               YearOfBirth: yearBrith },
            Communication: { Telephone: phoneNum } } },
      headers: {
          "Authorization":"Basic VG9tbXlHYW9fQVBJOkFuZ2VsSGFja3NAMTg="
      },
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var matchString = body.Record.RecordStatus;
      if (matchString == "match") match = true;
      console.log(body.Record.RecordStatus);
      console.log(match);
    });
    res.render('index');
    res.redirect('/');
});

module.exports = router;
