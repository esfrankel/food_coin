var express = require('express');
var router = express.Router();
var Web3 = require('web3');

var web3 = new Web3();

/* GET home page. */
router.get('/', function(req, res, next) {
  window.addEventListener('load', function() {

    // Check if Web3 has been injected by the browser:
    if (typeof web3 !== 'undefined') {
      // You have a web3 browser! Continue below!
      startApp(web3);
    } else {
       // Warn the user that they need to get a web3 browser
       // Or install MetaMask, maybe with a nice graphic.
    }

  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
