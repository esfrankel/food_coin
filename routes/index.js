var express = require('express');
var router = express.Router();
var match = false;
const User = require('../models/user');
const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');
const fs = require('fs');

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
  let contents = fs.readFileSync('foodcoin_token/build/contracts/FoodToken.json');
  const FoodToken = contract(JSON.parse(contents)['abi']);
  foodToken = FoodToken.at(distribution_address);
}

function initPurchaseContract (contract) {
  let contents = fs.readFileSync('foodcoin_token/build/contracts/Purchase.json');
  const Purchase = contract(JSON.parse(contents)['abi']);
  purchase = Purchase.at(grocery_address);
}

startApp(web3);

router.post('/dashboard', function(req, res, next) {
  purchase.purchase(req.body.id);
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

  let firstlast= first.toLowerCase() + last.toLowerCase();
  // let paid=
  // let date=
  let phonestring= phoneNum;
  let dobstring= ((monthBirth)+(dateBirth)+(yearBrith));
  let phone= +phoneNum;
  let dob= +((monthBirth)+(dateBirth)+(yearBrith));
  // console.log(firstlast);
  console.log(phone);
  // console.log(dob);

  let currentuser = ({
    firstlast: firstlast,
    paid: true,
    phone: phonestring,
    dob:dobstring
  });


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

    // request(options, function (error, response, body) {
    //   if (error) throw new Error(error);
    //   var matchString = body.Record.RecordStatus;
    //   if (matchString == "match") match = true;
    // ///////////////////////////////////////////////////////////GET HELP FROM TRULIOO STAFF!
    //   console.log(body.Record.RecordStatus);
    //   console.log(match);
    // });

    if(1==1){ // replace 1 with match

      User.findOne({phone:phone}, function(err, user) {
          if (err) {
            console.error(err);
          }
          if (user == null) {
            console.log('Make user');
            const usera = new User(currentuser);
            usera.save(function(err, usera) {
              if (err) {
                console.log(err);
              }
            });
            foodToken.transfer('0xEE80788557bC820eEA22B9372014626A6036eFE3','0x721A9f42fF992D0e508aceFa936392d3ac4Fccc5', 1).then(function(success){
              console.log(success);
            }).catch(function(err) {
              console.error(err);
            });
            //ERIC ADD SOME COINS TO THE ACCOUNT
          }
          else {
            if (user.paid) {
              console.log('ERIC DONT');
              //ERIC don't add money
            }
            else {
              console.log('Yay ! eric do');
              foodToken.transfer('0xEE80788557bC820eEA22B9372014626A6036eFE3','0x721A9f42fF992D0e508aceFa936392d3ac4Fccc5', 1).then(function(success) {
                console.log(success);
              }).catch(function(err) {
                console.error(err);
              });
              //ERIC add money
              User.update({ _id: user._id }, { $set: { paid: true }}, function(err, res) {
                  if (err) {
                    console.error(err);
                  }
                });
            }
          }
        });
        res.redirect('/');
    }
    else {
      console.log("bad information and could not verify. try again");
      res.redirect('/verify')
    }
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
