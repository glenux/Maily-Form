
const config = require('../../app/lib/config');
const SMTPServer = require('smtp-server').SMTPServer;
const MailParser = require('mailparser-mit').MailParser;

function withSmtpServer(callbackObj) {
    let listenTimeout = 1000;
    // Prepare the parser
    let mailparser = new MailParser();

    let closing = false;
    function onListen () {
        // console.log("DEBUG onListen callback");
        if (callbackObj.onListen) {
            callbackObj.onListen();
        }
    }

    function onMessage (mailObject) {
        // console.log("DEBUG onMessage callback");
        if (callbackObj.onMessage) {
            callbackObj.onMessage(mailObject);
        }
    }

    function onClose () {
        if (closing) return;

        closing = true;
        // console.log("DEBUG onClose callback");
        if (callbackObj.onClose) {
            callbackObj.onClose();
        }
    }

    // Prepare the smtp server
    let server = new SMTPServer({
        secure: false,
        authOptional: true,
        socketTimeout: 1000,
        closeTimeout: 1000,

        // Handle email reception
        onData(stream, session, callback) {
            // console.log("DEBUG mailparser.start");
            mailparser.on('end', (mailObject) => {
                // console.log("DEBUG mailparser.end");
                onMessage(mailObject);
                server.close(onClose);
            });
            stream.pipe(mailparser);

            return callback();
        }
    });


    // Listen for connections
    server.listen(config.smtpPort, () => {
        // console.log("DEBUG listen start");
        setTimeout(() => {
            // console.log("DEBUG listen stop");
            server.close(onClose)
        }, listenTimeout);

        // Make request
        onListen();
    });
}

module.exports = withSmtpServer;
