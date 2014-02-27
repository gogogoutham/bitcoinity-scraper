// Requirements
var request = require('request');

// Configuration variables
var bitcoinityUrl = "http://data.bitcoinity.org/export_data.csv";


// Gets a CSV from the Bitcoinity API and applies a callback to the response
exports.getCSV = function(options, callback) {
    request.get({ // Specification of full request
        url : bitcoinityUrl,
        qs : options
    }, function(error, response, csvData){ //Callback to deal with response
        if (!error && response.statusCode == 200) {
            callback(null, csvData);    
        } else {
            callback(error);
        }
    }); 
};

// Converts CSV string to custom javascript object for parsing; arranges as array of objects
exports.parseCSV = function(csvData) {
    //console.log(csvData);
    //csvData = csvData.toString();
    var data = {},
        rawLines = csvData.split("\n");
    data.rows = [];
    for (var i=0; i < rawLines.length; i++) {
        if( i === 0 ) { // Header line 
            data.headers = rawLines[i].split(",");
        }
        else { // Data line
            if ( (rawLines[i].trim()).length === 0 ) { // Skip line if empty (aside from whitespace)
                continue;
            }
            var row = {},
                cells = rawLines[i].split(",");
            for ( var j = 0; j < data.headers.length; j++ ) { // Bind header labels to data
                row[data.headers[j]] = cells[j];
            } 
            data.rows.push(row);
        }
    }
    return data;
};

// Prepare parsed data for SQL insertion; this includes wide-to-tall conversion and other items
exports.prepareForSQL = function(data) {
    var exchanges = data.headers.filter(function(value) {
        if( value != "Time" ) { return true; }
        else { return false; }
    }), sqlData = [];

    for( var i=0; i < data.rows.length; i++ ) {
        var time = (data.rows[i].Time.trim()).replace(" UTC", "+00"); 
        if( time.length !== 22 ) { // Skip row if time is not formatted correctly (only a basic check for now)
            continue;
        }
        for( var j=0; j < exchanges.length; j++ ) {
            var candidate = data.rows[i][exchanges[j]].trim();
            if(  !isNaN(parseFloat(candidate)) && isFinite(candidate) ) { // Only keep entries where there is data
                sqlData.push({
                    time: time, 
                    exchange: exchanges[j], 
                    value: parseFloat(candidate)
                });
            }
        }
    }

    return sqlData;
};