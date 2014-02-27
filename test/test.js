var bitcoinity = require(__dirname + "/../lib/bitcoinity"),
    pgloader = require(__dirname + "/../lib/pgloader"),
    util = require(__dirname + "/../lib/util"),
    bitcoinityScraper = require(__dirname + "/../lib/bitcoinity-scraper");


// ! Data Scraping and Parsing Test
// bitcoinity.getCSV({
//     data_type : "volume",
//     timespan : "10m",
//     volume_unit : "btc",
//     r : 'minute'
// }, function(csvData) { // Dump response on output
//     data = bitcoinity.parseCSV(csvData);
//     sqlData = bitcoinity.prepareForSQL(data);
//     console.log(sqlData)
// });


// ! PostgreSQL Load Test
// CREATE TABLE junk (a INTEGER, b INTEGER, PRIMARY KEY(a));
// INSERT INTO junk VALUES (1,5), (2,7);
// sqlData = [{'a':1,'b':2},{'a':3,'b':4}];
// pgloader.run(__dirname + '/.pgpass', 'junk', ['a','b'], ['a'], sqlData, pgloader.SQL_IGNORE);
//console.log(pgloader.generateSQL('junk', ['a','b'], ['a'], sqlData, scraperutil.SQL_REPLACE));
// DROP TABLE junk;

// ! Save Test
// util.saveFile(__dirname + '/data/test.txt', "Hello World!", function(err, result) {
//     if( err ) {
//         throw err;
//     } else {
//         console.log("Great success!");
//     }
// });

// ! Full Scrape Test
// CREATE TABLE volume_by_minute (time TIMESTAMP WITH TIME ZONE, exchange VARCHAR(15), value DOUBLE PRECISION, PRIMARY KEY(time, exchange));
// bitcoinityScraper.run({
//     data_type : "volume",
//     timespan : "10m",
//     volume_unit : "btc",
//     r : 'minute'
// }, __dirname + "/../.pgpass", "volume_by_minute", __dirname + "/../data/vbm_test.csv", function(err, result) {
//     if( !err ) {
//         console.log("Here at the end.");
//     } else {
//         throw err;
//     }
// });