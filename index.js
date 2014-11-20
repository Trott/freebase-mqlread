var client = require('request-json').newClient('https://www.googleapis.com');
var querystring = require('querystring');

exports.mqlread = function(query, options, callback) {
  var url = '/freebase/v1/mqlread?' +
    querystring.stringify({query: query}) +
    '&' + querystring.stringify(options);
  client.get(url, function(err, res, data) {
    if (!err) {
    	if (res.statusCode !== 200) {
    		err = new Error('Received status code ' + res.statusCode);
    	}
    	if (data && data.error) {
      	err = new Error(data.error.message);
    	}
    }
    callback(err, data);
  });
};