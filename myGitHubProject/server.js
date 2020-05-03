const express = require('express');
const app = express();
const randomString = require('randomstring');
const session = require('express-session');
const request = require('request');
const port = process.env.PORT || 4000;
const qs = require('querystring');

app.use(express.static('views'));

app.use(
    session({
        secret: randomString.generate(),
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res, next) => {
    req.session.csrf_string = randomString.generate();
    const githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: process.env.CLIENT_ID || 'ba36a3cff84ca6bb776c',
            redirect_uri: 'http://localhost:4000/redirect',
            state: req.session.csrf_string,
            scope: 'user:email'
        });
    res.redirect(githubAuthUrl);
});

app.all('/redirect', (req, res) => {
    const code = req.query.code;
    console.log("code is : ", code);
    const returnedState = req.query.state;
    console.log("state is :", returnedState);
    if (req.session.csrf_string === returnedState) {
      request.post(
        {
          url:
            'https://github.com/login/oauth/access_token?' +
            qs.stringify({
              client_id: process.env.CLIENT_ID || 'ba36a3cff84ca6bb776c',
              client_secret: process.env.CLIENT_SECRET || '85b17e11edff21e5583ded6a0a81d2e7a8185945',
              code: code,
              redirect_uri: 'http://localhost:4000/redirect',
              state: req.session.csrf_string
            })
        },
        (error, response, body) => {
          req.session.access_token = qs.parse(body).access_token;
          //console.log("access token is : ", qs.parse(body).access_token);
          res.redirect('/user');
        }
      );
    } else {
      res.redirect('/');
    }
  });

require('./app/routes/git.routes.js')(app);
app.listen(port, () => {
    console.log('Server listening at port ' + port);
});