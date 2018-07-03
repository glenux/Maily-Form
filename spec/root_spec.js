/*global describe, it, expect */

/*
var mocha = require('mocha'),
    it = mocha.it,
    describe = mocha.describe;

var chai = require('chai'),
    assert = require('chai').assert,
    expect  = require('chai').expect;
*/

var request = require('request');

describe('Root API', function() {
	describe('GET /', function() {
		var url = "http://localhost:8080/";

		it('returns status 200', function(done) {
			request(url, function(error, response, body) {
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
