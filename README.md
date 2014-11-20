freebase-mqlread
================

Microlibrary to execute read-only [Metaweb Query Language (MQL) queries](https://developers.google.com/freebase/v1/mql-overview) on [Freebase](http://freebase.com/)

## Installation

`npm install --save mqlread`

## Usage

````javascript
var freebase = require('mqlread');

var callback = function (err, data) {
	console.log(data);
};
var query = '{"type":"/people/person","id":"/en/madonna","children":[]}';
var options = {key: 'YOUR_API_KEY', as_of_time: '2009-01'};

freebase.mqlread(query, options, callback);
````
