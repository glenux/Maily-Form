
var config;
if (process.env.NODE_ENV === 'production') {
    // In production : read config from the environment or use default values
    config = {
        formName: 'anonymous',

        // Admin credentials to access the dashboard
        adminUsername: process.env.ADMIN_USERNAME || null,
        adminPassword: process.env.ADMIN_PASSWORD || null,
        adminRealm: process.env.ADMIN_REALM || 'Maily-Form Administration',

        // Parameters to send emails
        smtpHost: process.env.SMTP_HOST || null,
        smtpPort: process.env.SMTP_PORT || null,
        smtpUser: process.env.SMTP_USER || null,
        smtpPass: process.env.SMTP_PASS || null,
        smtpSsl: process.env.SMTP_SSL || false,
        smtpAuth: process.env.SMTP_AUTH || false,

        // Text content for success and error messages
        messageSuccess: process.env.MESSAGE_SUCCESS || 'Thank you for your submission.',
        messageError: process.env.MESSAGE_ERROR || 'Unable to forward your submission',

        subjectSuccess: process.env.SUBJECT_SUCCESS || 'New submission from __FORM_NAME__',
        subjectError: process.env.SUBJECT_ERROR || 'Error in submission from __FORM_NAME__',

        // Response format (accepts 'json' or 'html')
        responseFormat: process.env.RESPONSE_FORMAT || 'json',

        // Security (or lack-of)
        accessControlAllowOrigin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',

        // Server
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8080
    }
} else {
    // In test : set hard-coded values
    config = {
        formName: 'anonymous',

        // Admin credentials to access the dashboard
        adminUsername: 'admin',
        adminPassword: 'admin',
        adminRealm: 'Maily-Form Administration',

        // Parameters to send emails
        smtpHost: 'localhost',
        smtpPort: 1025,
        smtpUser: null,
        smtpPass: null,
        smtpSsl: false,
        smtpAuth: false,

        // Text content for success and error messages
        messageSuccess: 'Thank you for your submission.',
        messageError: 'Unable to forward your submission',

        subjectSuccess: 'New submission from __FORM_NAME__',
        subjectError: 'Error in submission from __FORM_NAME__',

        // Response format (accepts 'json' or 'html')
        responseFormat: 'json',

        // Security (or lack-of)
        accessControlAllowOrigin: '*',

        // Server
        host: '0.0.0.0',
        port: 8080
    }
}

module.exports = config;

