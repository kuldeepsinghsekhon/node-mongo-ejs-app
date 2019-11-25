const DBHOST = process.env.DBHOST ;
const DBUSER = process.env.DBUSER;
const DBKEY = process.env.DBKEY;
const DBNAME = process.env.DBNAME;

dbPassword = `mongodb+srv://${DBUSER}:`+ encodeURIComponent(`${DBKEY}`) + `${DBHOST}/${DBNAME}?retryWrites=true&w=majority`;

module.exports = {
    mongoURI: dbPassword
};
