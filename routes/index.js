var express = require('express');
var router = express.Router();
var match = false;
const User = require('../models/user');


//const Web3 = require('web3')

//const web3 = new Web3( new Web3.providers.HttpProvider('http://localhost:8545'));

const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'FoodCoin'});
//  console.log(web3.eth.accounts);
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
            Communication: { Telephone: phonestring } } },
      headers: {
          "Authorization":"Basic VG9tbXlHYW9fQVBJOkFuZ2VsSGFja3NAMTg="
      },
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var matchString = body.Record.RecordStatus;
      if (matchString == "match") match = true;
    //////////////////////GET HELP FROM TRULIOO STAFF!
      console.log(body.Record.RecordStatus);
      console.log(match);
    });

    if(match){ // replace 1 with match

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
            //ERIC ADD SOME COINS TO THE ACCOUNT

          }
          else {
            if (user.paid) {
              console.log('ERIC DONT');
              //ERIC don't add money
            }
            else {
              console.log('Yay ! eric do');
              //ERIC add money

              //update user.paid to 1

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
