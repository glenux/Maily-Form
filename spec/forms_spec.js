
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

        it('sends email and returns HTTP status code 200', (done) => {
            let formData = {};

            withSmtpServer({
                onListen: (_server) => {
                    request.post(
                        { url, formData },
                        (error, response, _body) => {
                            assert.strictEqual(response.statusCode, 200);
                        }
                    );
                },

                onClose: () => {
                    done();
                }
            });
        });

        it('sends email and set properly the _replyTo header (when set)', (done) => {
            let formData = {
                "_replyTo": 'loveIsAll@example.com'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.strictEqual(
                        mailObject.headers['reply-to'],
                        /* eslint-disable-next-line no-underscore-dangle */
                        formData._replyTo
                    );
                },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // do nothing
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });
        });

        it('sends email and redirects according to _redirectTo (when set)', (done) => {
            let formData = {
                "_redirectTo": 'https://example.com'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: () => {
                    messageCounter += 1;
                },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, response, _body) => {
                            // Final location must be _redirectTo value
                            assert.strictEqual(
                                response.headers.location,
                                /* eslint-disable-next-line no-underscore-dangle */
                                formData._redirectTo
                            );
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });

        });

        it('send email with formName in title (when set)', (done) => {
            let formData = {
                "_formName": 'loveIsAll'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.include(
                        mailObject.subject,
                        /* eslint-disable-next-line no-underscore-dangle */
                        formData._formName
                    );
                },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // do nothing
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
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

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // do nothing
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 0);
                    done();
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

