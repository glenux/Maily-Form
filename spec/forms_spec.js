
var chai = require('chai'),
    mocha = require('mocha'),
    request = require('request');

var assert = chai.assert,
    expect = chai.expect;

var describe = mocha.describe,
    it = mocha.it;

describe('Forms API', () => {
    describe('POST /', () => {
        var url = "http://localhost:8080/";
        var formData = {};

        it('returns HTTP status code 200', (done) => {
            request.post(
                {
                    url,
                    formData
                },
                (error, response, _body) => {
                    expect(response.statusCode).to.equal(200);
                    done();
                }
            );
        });

        it('returns a success message', (done) => {
            request.post(
                { url,
                  formData
                },
                (_error, _response, body) => {
                    expect(body).to.include('Thank you for your submission');
                    done();
                }
            );
        });
    });
});

