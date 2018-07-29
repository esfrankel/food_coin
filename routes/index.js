var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
    var data = JSON.stringify({
        "CountryCode": "US",
        "Demo": "true",
        "AcceptTruliooTermsAndConditions": "true",
        "DataFields": {
            "PersonInfo": {
                "FirstGivenName": "John",
                "MiddleName": "Henry",
                "FirstSurName": "Smith",
                "DayOfBirth": 5,
                "MonthOfBirth": 3,
                "YearOfBirth": 1983
            },
            "Communication": {
                "Telephone": "0398968785"
            }
        }
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "https://api.globalgateway.io/verifications/v1/verify");

    xhr.send(data);
    res.render('index');
});

module.exports = router;
