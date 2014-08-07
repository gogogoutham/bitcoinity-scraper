bitcoinity-scraper
==================

A node.js and PostgreSQL based module for scraping data from data.bitcoinity.org

Installation
============

Clone the repository, and run npm install in your favorite node development environment. Alternatively, running this in your node project folder should work:

```
npm install git://github.com/gseshadri/bitcoinity-scraper.git
```

Setup
=====

A couple of database setup steps are required:

1. Creation of target tables in PostgreSQL - See the sql/ directory for the general format. Table names and quantity are changable (the scraping engine will work just fine), but column names and primary keying should not be changed - these are intimately linked to how the scraping engine loads data into the DB. 

2. Specification of connection parameters - This must be done through a PostgreSQL password file. See here for the correct format (9.1):

http://www.postgresql.org/docs/9.1/static/libpq-pgpass.html


Usage
=====

This is an end-to-end scraping library that will pull the data you want from data.bitcoinity.org, save the CSV contents in a location of your chosing, and load the data into a PostgresSQL table of your choosing. To use, simply require the bitcoinity-scraper module and run:

```javascript

var bitcoinityScraper = require('bitcoinity-scraper');

bitcoinityScraper.run(
    { // Get string parameters for request; see various tabs in data.bitcoinity.org to configure
        data_type : 'volume', // Type of data
        timespan : '3d', // The lookback amount of time over which to pull in the data 
        r : 'minute' // The time basis overwhich to aggregate the data
    },
    '.pgpass', // Database connection parameters sepcified as PostgreSQL style password file
    'volume_by_minute', // Table name
    'mydatadir/mydata.csv', // File to save data to
    function(err, result) { // Handler on finish
        if ( !err ) {
            console.log("Success!");
        }
        else {
            console.log("Unable to scrape data.");
            throw err;
    }
});
```

Some stock examples of this type of scraper can be viewed in the example/ directory.

If you wish to decouple file saving, table loading, URL requests from one another, please have a look at the methods in lib/utility.js, lib/pgloader.js, and lib/bitcoinity.js respectively.



