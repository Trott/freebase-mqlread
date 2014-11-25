var hyperquest = require('hyperquest');
var querystring = require('querystring');

exports.mqlread = function(query, options, callback) {
  var url = 'https://www.googleapis.com/freebase/v1/mqlread?' +
    querystring.stringify({query: query}) +
    '&' + querystring.stringify(options);

  hyperquest(url, {}, function(err, res) {
    if (err) {
      callback(err);
      return;
    }
    var body = '';
    if (res.statusCode !== 200) {
      err = new Error('Received status code ' + res.statusCode);
      callback(err);
      return;
    }
    res.on('data', function (chunk) {
      body +=chunk;
    });

    res.on('end', function () {
      var data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        callback(new Error('Error in received JSON:' + e.message));
        return;
      }
      if (data.error) {
       err = new Error(data.error.message);
     }
      callback(err, data);
    });
  });
};