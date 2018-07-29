var express = require('express');
var router = express.Router();
var match = false;
const User = require('../models/user');
const fs = require('fs');

const Web3 = require('web3')

const web3 = new Web3( new Web3.providers.HttpProvider('http://localhost:8545'));

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

const request = require('request')

const distribution_address = web3.eth.accounts[0];
console.log(distribution_address);
const grocery_address = web3.eth.accounts[1];
const delivery_address = web3.eth.accounts[2];

var foodToken;

function startApp (web3) {
  // let contents = fs.readFileSync('foodcoin_token/build/contracts/FoodToken.json');
  // const FoodToken = new web3.eth.Contract(contents, )
  let contents = fs.readFileSync('foodcoin_token/build/contracts/FoodToken.json');
  let abi = JSON.parse(contents)['abi'];
  var address = '0x8fc965daa172516133bbed68f0a01123519a00df';
  foodToken = web3.eth.contract(abi).at(address);

  // const eth = new Eth(web3.currentProvider);
  // const contract = new EthContract(eth);
  // initFoodContract(contract);
}


function initFoodContract (contract) {
  let contents = fs.readFileSync('foodcoin_token/build/contracts/FoodToken.json');
  const FoodToken = contract(JSON.parse(contents)['abi']);
  console.log(FoodToken);
  foodToken = FoodToken.at('0x6d51b2eb8c7d921425b2607a9392533f0d10e109');
  console.log(foodToken);
}

startApp(web3);


router.post('/dashboard', function(req, res, next) {
  foodToken.myTransfer({from: delivery_address, to: grocery_address});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'FoodCoin'});
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
            // console.log(typeof delivery_address)
            // console.log(grocery_address)
            foodToken.myTransfer(delivery_address, grocery_address, web3.toWei("1", "ether"));
            //ERIC ADD SOME COINS TO THE ACCOUNT
          }
          else {
            if (user.paid) {
              console.log('ERIC DONT');
              //ERIC don't add money
            }
            else {
              console.log('Yay ! eric do');
              foodToken.myTransfer(delivery_address, grocery_address, web3.toWei("1", "ether"));
              // foodToken.myTransfer(from: delivery_address, to: grocery_address, value:web3.toWei("1", "ether"));
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
