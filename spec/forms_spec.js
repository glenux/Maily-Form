/*global describe, it, expect */

var chai = require('chai'),
	mocha = require('mocha'),
    request = require('request');

/* FIX: assert = chai.assert, */
var expect = chai.expect;

var describe = mocha.describe,
	it = mocha.it;

describe('Forms API', () => {
	describe('POST /', () => {
		var url = "http://localhost:8080/";
		var formData = {};

		it('returns status 200', function(done) {
			request.post({ url: url, formData: formData }, function(error, response, body) {
        		expect(response.statusCode).to.equal(200);
        		done();
      		});
		});

		it('returns JSON content', function(done) {
			request.post({ url: url, formData: formData }, function(error, response, body) {
			 	expect(body).to.include('Maily-Form');
			 	expect(body).to.include('works');
        		done();
      		});
		});
	});
});
