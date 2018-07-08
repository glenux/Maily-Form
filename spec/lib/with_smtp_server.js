
const config = require('../../app/lib/config');
const SMTPServer = require('smtp-server').SMTPServer;
const MailParser = require('mailparser-mit').MailParser;

function withSmtpServer(callbackObj) {
    // Prepare the parser
    let mailparser = new MailParser();

    // Prepare the smtp server
    let server = new SMTPServer({
        secure: false,
        authOptional: true,

        // Handle email reception
        onData(stream, session, callback) {
            mailparser.on('end', (mailObject) => {
                server.close();
                callbackObj.onMessage(mailObject);
            });
            stream.pipe(mailparser);

            return callback();
        }
    });


    // Listen for connections
    server.listen(config.smtpPort, () => {
        // Make request
        callbackObj.onListen(server);
    });
}

module.exports = withSmtpServer;
