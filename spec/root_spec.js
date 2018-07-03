
var chai = require('chai'),
	mocha = require('mocha'),
    request = require('request');

/* FIX: assert = chai.assert, */
var expect = chai.expect;

var describe = mocha.describe,
	it = mocha.it;

describe('Root API', () => {
	describe('GET /', () => {
		var url = "http://localhost:8080/";

		it('returns HTTP status code 200', (done) => {
			request(url, (error, response, body) => {
				expect(response.statusCode).to.equal(200);
				done();
			});
		});

		it('returns HTML content', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.include('Maily-Form');
				expect(body).to.include('works');
				done();
			});
		});
	});
});
