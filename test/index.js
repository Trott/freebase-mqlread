var rewire = require('rewire');
var freebase = rewire('../index.js');

var Code = require('code');
var expect = Code.expect;

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.experiment;
var it = lab.test;
var beforeEach = lab.beforeEach;

describe('mqlread()', function () {
	var revert;

	beforeEach(function (done) {
		if (typeof revert === 'function') {
			revert();
			revert = null;
		}
		done();
	});

	it('should return an error if no query supplied', function (done) {
		var callback = function (err) {
			expect(err).to.be.not.null();
			done();
		};

		freebase.mqlread('', {}, callback);
	});

	it('should return data for a query', function (done) {
		var callback = function (err, data) {
			expect(err).to.be.null();
			expect(data.result).to.be.not.null();
			done();
		};

		var query = '{"type":"/people/person","id":"/en/madonna","children":[]}';
		var options = {as_of_time: '2009-01'};
		freebase.mqlread(query, options, callback);
	});

	it('should return an error from underlying callback', function (done) {
		revert = freebase.__set__({client: {
			get: function (url, cb) {
				cb(new Error('fhqwhagads'));
			}
		}});

		var callback = function (err) {
			expect(err).to.deep.equal(new Error('fhqwhagads'));
			done();
		};

		freebase.mqlread(null, null, callback);
	});

	it('should return an error if status code is not 200', function (done) {
		revert = freebase.__set__({client: {
			get: function (url, cb) {
				cb(null, {statusCode: 404}, null);
			}
		}});

		var callback = function (err) {
			expect(err).to.be.not.null();
			done();
		};

		freebase.mqlread(null, null, callback);
	});
});
