
// read config from the environment or use default values
module.exports = {
	formName: 'anonymous',
	messageSubject: 'New submission from __MESSAGE_FORM__',

	// Admin credentials to access the dashboard
	adminUsername: process.env.ADMIN_USERNAME || null,
	adminPassword: process.env.ADMIN_PASSWORD || null,

	// Parameters to send emails
	emailHost: process.env.EMAIL_HOST || null,
	emailPort: process.env.EMAIL_PORT || null,
	emailUser: process.env.EMAIL_USER || null,
	emailPass: process.env.EMAIL_PASS || null,
	emailSecure: process.env.EMAIL_SECURE || false,

	// Security (or lack-of)
	accessControlAllowOrigin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',

	// Server
	host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT || 8080
};
