var freebase = require('../index.js');

var nock = require('nock');

var Code = require('code');
var expect = Code.expect;

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.experiment;
var it = lab.test;
var beforeEach = lab.beforeEach;

describe('mqlread()', function () {

	beforeEach(function (done) {
		nock.cleanAll();
		nock.enableNetConnect();
		done();
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
		nock.disableNetConnect();

		var callback = function (err) {
			expect(err.name).to.equal('NetConnectNotAllowedError');
			done();
		};

		freebase.mqlread(null, null, callback);
	});

	it('should return an error if status code is not 200', function (done) {
		nock('https://www.googleapis.com')
			.get('/freebase/v1/mqlread?query=&')
			.reply(400);
		var callback = function (err) {
			expect(err).to.be.an.object();
			done();
		};

		freebase.mqlread(null, null, callback);
	});

	it('should return an error if it receives invalid JSON', function (done) {
		nock('https://www.googleapis.com')
			.get('/freebase/v1/mqlread?query=&')
			.reply(200, 'invalid JSON!');

		var callback = function (err) {
			expect(err).to.be.an.object();
			done();
		};

		freebase.mqlread(null, null, callback);
	});

	it('should return an error if there is an error specified in the JSON', function (done) {
		nock('https://www.googleapis.com')
			.get('/freebase/v1/mqlread?query=&')
			.reply(200, '{"error": {"message": "Oh noes!"}}');

		var callback = function (err) {
			expect(err).to.be.an.object();
			done();
		};

		freebase.mqlread(null, null, callback);
	});
});
