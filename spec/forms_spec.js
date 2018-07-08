
const chai = require('chai');
const mocha = require('mocha');
const request = require('request');

const assert = chai.assert;
// const expect = chai.expect;

const describe = mocha.describe;
const it = mocha.it;

const withSmtpServer = require('./lib/with_smtp_server');

describe('Forms API', () => {
    describe('POST /', () => {
        let url = "http://localhost:8080/";

        /*
         *   Forms API
         */

        it('returns HTTP status code 200', (done) => {
            let formData = {};

            request.post(
                { url, formData },
                (error, response, _body) => {
                    assert.strictEqual(response.statusCode, 200);
                    done();
                }
            );
        });

        it('set properly the _replyTo header (when set)', (done) => {
            let formData = {
                "_replyTo": 'loveIsAll@example.com'
            };

            withSmtpServer({
                onMessage: (mailObject) => {
                    assert.strictEqual(
                        mailObject.headers['reply-to'],
                        /* eslint-disable-next-line no-underscore-dangle */
                        formData._replyTo
                    );
                    done();
                },

                onListen: (server) => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // Force close after 2secs
                            setTimeout(() => server.close(), 2000);
                        }
                    );
                }
            });
        });

        it.skip('redirects according to _redirectTo (when set)', (done) => {
            done();
        });

        it('send email with formName in title (when set)', (done) => {
            let formData = {
                "_formName": 'loveIsAll'
            };

            withSmtpServer({
                onMessage: (mailObject) => {
                    assert.include(
                        mailObject.subject,
                        /* eslint-disable-next-line no-underscore-dangle */
                        formData._formName
                    );
                    done();
                },

                onListen: (server) => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // Force close after 2secs
                            setTimeout(() => server.close(), 2000);
                        }
                    );
                }
            });
        });

        it('blocks email when _t_email is not empty', (done) => {
            let formData = {
                "_t_email": 'iAmABot'
            };

            let messageCounter = 0;
            withSmtpServer({
                onMessage: (_mailObject) => { messageCounter += 1; },

                onListen: (server) => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // Force close after 2secs
                            setTimeout(() => {
                                assert.strictEqual(messageCounter, 0);
                                server.close()
                                done();
                            }, 500);
                        }
                    );
                }
            });
        });

        it('returns a success message', (done) => {
            let formData = {};
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

