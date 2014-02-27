// Requirements
var bitcoinityScraper = require(__dirname + "/../lib/bitcoinity-scraper"),
    async = require("async");

// Configuration
var dbConfFile = __dirname + "/../.pgpass";
var dataDir = __dirname + "/../data";

// Helper method for generating scraping tasks more easily
var runTime = (new Date()).getTime();
var taskGenerator = function(dataType, ts, regularity) {
   return function(cb) { 
        bitcoinityScraper.run({
            data_type : dataType,
            timespan : ts,
            r : regularity
        }, 
        dbConfFile, 
        dataType + "_by_" + regularity,
        dataDir + "/" + dataType + "_by_" + regularity + "_for_last_" + ts + "_on_" + runTime + ".csv",
        cb); 
    }; 
};

// Now attempt scraping the initial data dumps (will span quite a while)
async.parallel([
    taskGenerator('volume', '3d', 'hour'),
    taskGenerator('price', '3d', 'hour'),
    taskGenerator('tradespm', '3d', 'hour'),
    taskGenerator('volume', '3d', 'day'),
    taskGenerator('price', '3d', 'day'),
    taskGenerator('tradespm', '3d', 'day')
], function(err, result) {
    if ( !err ) {
        console.log("Overall Success. Finished Everything.");
    }
    else {
        console.log("Could not finish everything.");
        throw err;
    }
});
