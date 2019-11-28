const DBHOST = process.env.DBHOST ;
const DBUSER = process.env.DBUSER;
const DBKEY = process.env.DBKEY;
const DBNAME = process.env.DBNAME;

dbPassword = `mongodb+srv://${DBUSER}:`+ encodeURIComponent(`${DBKEY}`) + `${DBHOST}/${DBNAME}?retryWrites=true&w=majority`;




var braintree = require("braintree");
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dwt5m34ppngz6s7k",       //merchant id
  publicKey: "g2d976m7dxpt6bx5",        //public key
  privateKey: "117df9268ade2b95fc3f526966441059" //private key
});
module.exports = {
    mongoURI: dbPassword,
    gateway:gateway
};