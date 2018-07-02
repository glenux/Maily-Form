# Maily Form

This is a self-hosted service you can use to place forms on static sites. It uses [nodemailer](https://nodemailer.com/about/) and you can host it with Docker. It is developed by [jlelse](https://about.jlelse.de) mainly for own purposes.

[DockerHub](https://hub.docker.com/r/jlelse/maily-form/)

*It is currently in development and it's not advised to use in production yet.*

## Parameters

`PORT` (optional): The port to which the server should listen, default 8080  
`EMAIL_USER` (required): The SMTP user  
`EMAIL_PASS` (required): The SMTP password  
`EMAIL_HOST` (required): The SMTP host  
`EMAIL_PORT` (required): The SMTP port  
`EMAIL_SECURE` (required): If the mail should be send on a secure port  
`FROM` (required): The sender, should be like `Forms forms@example.com`  
`TO` (required): Default recipient  
`ALLOWED_TO` (optional): All allowed recipients  
`ACCESS_CONTROL_ALLOW_ORIGIN` (required): The Access-Control-Allow-Origin CORS header

If you want to use the admin panel at `/admin`, you have to set this too:  
`ADMIN_USERNAME` (optional): Admin username  
`ADMIN_PASSWORD` (optional): Admin password

## Special form fields

`_to`: Recipient, if `ALLOWED_TO` is set, it must be in that list, hidden, optional  
`_replyTo`: Email address which should be configured as replyTo, (most probably not hidden), optional  
`_redirectTo`: URL to redirect to, hidden, optional  
`_formName`: Name of the form, hidden, optional  
`_t_email`: "Honeypot" field, not hidden, advised (see notice below)  

You can find a sample in the `form.html` file.

Notice to the honeypot field: Maily Form offers the option to use a [Honeypot](https://en.wikipedia.org/wiki/Honeypot_(computing)) field, which is basically another input, but it's hidden to the user with either a CSS rule or some JavaScript. It is very likely, that your public form will get the attention of some bots some day and then the spam starts. But bots try to fill every possible input field and will also fill the honeypot field. But Maily Form is really clever and refuses to send mails where the honeypot field is filled. So you should definitely use it.

## Installation

You can simply start a Docker container with the parameters listed above. You can also use `docker-compose`.

Sample part of a compose file for Maily Form:

```
forms:
    image: jlelse/maily-form
    container_name: forms
    restart: unless-stopped
    environment:
        - EMAIL_USER=mail@example.com
        - EMAIL_PASS=yourSUPERsecretPASSWORD123
        - EMAIL_HOST=smtp.your-mail-provider.com
        - EMAIL_PORT=587
        - EMAIL_SECURE=false
        - TO=mail@example.com
        - ALLOWED_TO="mail1@example.com,mail2@example.com"
        - FROM="Forms forms@example.com"
        - ACCESS_CONTROL_ALLOW_ORIGIN="example.com"
```
