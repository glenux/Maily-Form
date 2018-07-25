
const chai = require('chai');
const mocha = require('mocha');
const request = require('request');

/* eslint-disable-next-line no-unused-vars */
const assert = chai.assert;
const expect = chai.expect;

const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;
const it = mocha.it;

const app = require('../app/server');
var port, server, url;

beforeEach((done) => {
    // create listener with random port & store port when ready
    server = app.listen(0, () => {
        port = server.address().port;
        url = `http://localhost:${port}/`;
        done();
    });
});

afterEach((done) => {
    server.close(done);
});

describe('Root API', () => {
	describe('GET /', () => {

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

