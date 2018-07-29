var express = require('express');
var router = express.Router();
const window = require('window');
var Web3 = require('web3');

// For connecting to local blockchain
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// var Web3 = require('web3');
// var web3 = new Web3();
// web3.setProvider(window.web3.currentProvider);
// for connecting to metamask
// let web3 = ;
// let web3 = new Web3(Web3.currentProvider)

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(web3);

  // window.addEventListener('load', function() {
  //
  //   // Check if Web3 has been injected by the browser:
  //   if (typeof web3 !== 'undefined') {
  //     web3 = new Web3(web3.currentProvider);
  //   } else {
  //     // set the provider you want from Web3.providers
  //     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  //   }
  //
  // });
  web3.eth.getBlock(1, function(err, res) {
    console.log(res);
  })
  web3.eth.getAccounts(function(err,res){
    console.log(res)
  })
  res.render('index');
});

module.exports = router;
