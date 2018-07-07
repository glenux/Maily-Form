
const chai = require('chai');
const mocha = require('mocha');
const request = require('request');

const assert = chai.assert;
// const expect = chai.expect;

const describe = mocha.describe;
const it = mocha.it;

const config = require('../app/lib/config');
const SMTPServer = require('smtp-server').SMTPServer;

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
                    assert.strictEqual(response.statusCode, 200);
                    done();
                }
            );
        });

        it('send email according to _replyTo (when set)', (done) => {
            // prepare smtp server
            //  - add handler on email reception
            const server = new SMTPServer({
            	secure: false,
                onMailFrom(address, session, callback) {
                    console.log("TAMERE");
                    console.log(address);
                    // assert.strictEqual(address, 'Success');
                    done();

                    return callback();
                }
            });

            // listen
            console.log('SMTP port = %s', config.smtpPort);
            server.listen(config.smtpPort, () => {
                //   - make request
                request.post(
                    { url, formData },
                    (_error, _response, _body) => {
                        // FIXME
                        console.log('Received API response');
                        console.log(_error);
                        setTimeout( () => server.close(), 2000);
                    }
                 );
                //   - handle response
            });
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
                    assert.include(body, 'Success');
                    done();
                }
            );
        });
    });
});

