
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

        /*
         *   Forms API
         */

        it('returns HTTP status code 200', (done) => {
            request.post(
                { url, formData },
                (error, response, _body) => {
                    expect(response.statusCode).to.equal(200);
                    done();
                }
            );
        });

        it.skip('send email according to _replyTo (when set)', (done) => {
            done();
        });

        it.skip('redirects according to _redirectTo (when set)', (done) => {
            done();
        });

        it.skip('send email with formName in title (when set)', (done) => {
            done();
        });

        it.skip('blocks email when _t_email is not empty', (done) => {
            done();
        });

        it('returns a success message', (done) => {
            request.post(
                { url, formData },
                (_error, _response, body) => {
                    expect(body).to.include('Success');
                    done();
                }
            );
        });
    });
});

