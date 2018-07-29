var express = require('express');
var router = express.Router();
var match = false;
const User = require('../models/user');
const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

const Web3 = require('web3')

const web3 = new Web3( new Web3.providers.HttpProvider('http://localhost:8545'));

const request = require('request')

const distribution_address = '0xEE80788557bC820eEA22B9372014626A6036eFE3';
const grocery_address = '0x69F7E0d12C7885DE1a1c005Df6118aAb6a1d73f1';

var foodToken;
var purchase;

function startApp (web3) {
  const eth = new Eth(web3.currentProvider);
  const contract = new EthContract(eth);
  initFoodContract(contract);
  initPurchaseContract(contract);
}

function initFoodContract (contract) {
  const FoodToken = contract('../foodcoin_token/build/contracts/FoodCoin.json');
  foodToken = FoodToken.at(distribution_address);
}

function initPurchaseContract (contract) {
  const Purchase = contract('../foodcoin_token/build/contracts/Purchase.json');
  purchase = Purchase.at(grocery_address);
}

startApp(web3);

router.post('/dashboard', function(req, res, next) {
  Purchase.purchase(req.body.id);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'FoodCoin'});
  console.log(web3.eth.accounts);
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard/index.hbs')
})

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
    // res.render('index');
    res.redirect('./dashboard/index');
});

router.get('/test/testform', (req, res) => {
    res.render('test/testform');
});


router.get('/test', (req, res) => {
    User.find({}, function(err, user) {
        if(err) { console.error(err) };

    res.render('test/index', {user:user});
    });
});




router.post('/test/testform', (req, res) => {
 const user = new User(req.body);
 user.save(function(err, user) {
   if (err) {
     console.log(err);
   }
   return res.redirect('/test/');
 });
});

module.exports = router;
