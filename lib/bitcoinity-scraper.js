var async = require('async'),
    bitcoinity = require(__dirname + "/bitcoinity"),
    pgloader = require(__dirname + "/pgloader"),
    util = require(__dirname + "/util");

// Bundles all scraping functions (URL request, parsing, file saving, DB loading) into one method; executes asynchronously
exports.run = function(scraperOptions, dbConfigFile, outTable, outFile, callback) {

    // Wraps the function in an an asynchronously executing block that responds with the usual error / response paradigm of asynchronous execution
    // First argument should be a function; all other arguments should the (ordered) arguments to that function
    var asynchronizeTask = function() {
        var args = Array.prototype.slice.call(arguments),
            retval;
        return function(cb) {
            setTimeout( function() {
                retval = args[0].apply(args.slice(1));
                if( retval instanceof Error ) {
                    cb(retval, null);
                } else {
                    cb(null, retval);
                }                  
            }, 0);
        };
    };

    var parseAndLoad = function(csvData) {
        return pgloader.run(dbConfigFile, 
            outTable, 
            ['time','exchange','value'], 
            ['time', 'exchange'], 
            bitcoinity.prepareForSQL(bitcoinity.parseCSV(csvData)), 
            pgloader.SQL_REPLACE);
    };

    bitcoinity.getCSV(scraperOptions, function(err, csvData) {
        if( !err ) {
            console.log("Request for the for the following was successful: %o", scraperOptions);
            console.log("Now attempting to store data.");
            async.parallel([
                (function(cb) { util.saveFile(outFile, csvData, cb); }),
                (function(cb) {
                    setTimeout( function() {
                        retval = parseAndLoad(csvData);
                        if( retval instanceof Error ) {
                            cb(retval, null);
                        } else {
                            cb(null, retval);
                        }                  
                    }, 0);
                })
                // asynchronizeTask(parseAndLoad, csvData)
            ], function(err, result) {
                callback(err, result);
            });
        }
        else {
            console.log("Could not make the following http request to bitcoinity: %o", scraperOptions);
            callback(err, null);
        }
    });
};