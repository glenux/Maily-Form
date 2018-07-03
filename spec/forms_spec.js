/*global describe, it, expect */

var request = require('request');

describe('Forms API', function() {
	describe('POST /', function() {
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
