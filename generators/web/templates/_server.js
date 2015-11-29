/**
 * @description Static HTTP Server
 * @see [Using Express.js Middleware]{@link http://expressjs.com/guide/using-middleware.html}
 * @see [Third-Party Middleware]}@link http://expressjs.com/resources/middleware.html}
 * @see [krakenjs/lusca]{@link https://github.com/krakenjs/lusca}
**/
var express  = require('express');
var session  = require('express-session');
var lusca    = require('lusca');
var compress = require('compression');
var config   = require('config');
var app = express()
    .use(session(config.get('session')))
    .use(function (req, res, next) {
        res.set('X-CSRF', config.get('session').secret);
        return next();
    })
    .disable('x-powered-by')               /** Do not advertise Express **/
    .use(lusca.csrf())                     /** Cross Site Request Forgery **/
    .use(lusca.csp({policy: config.csp}))  /** Content Security Policy **/
    .use(lusca.xframe('SAMEORIGIN'))       /** Helps prevent Clickjacking **/
    .use(lusca.hsts({ maxAge: 31536000 }))
    .use(lusca.xssProtection(true))
    .use(compress())                       /** Use gzip compression **/
    .use(express.static(__dirname));       /** Serve static files **/
app.get('/', function(req, res) {
    if (res.get('X-CSRF') === config.get('session').secret) {
        res.redirect('/client');
    } else {
        res.status(412).end();
    }
});
module.exports = app;