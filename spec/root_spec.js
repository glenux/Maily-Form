
var chai = require('chai'),
	mocha = require('mocha'),
    request = require('request');

/* eslint-disable-next-line no-unused-vars */
var assert = chai.assert,
	expect = chai.expect;

var describe = mocha.describe,
	it = mocha.it;

describe('Root API', () => {
	describe('GET /', () => {
		var url = "http://localhost:8080/";

		it('returns HTTP status code 200', (done) => {
			request(url, (error, response, _body) => {
				expect(response.statusCode).to.equal(200);
				done();
			});
		});

		it('returns HTML content', (done) => {
			request(url, (error, response, body) => {
				expect(body).to.include('Maily-Form');
				expect(body).to.include('works');
				done();
			});
		});
	});
});

