const request = require('request');
var path = require('path');
let config = require('../../config/config.js');
exports.user = (req, res) => {
    request.get(
        {
            url: 'https://api.github.com/user/public_emails',
            headers: {
                Authorization: 'token ' + req.session.access_token,
                'User-Agent': 'Login-App'
            }
        },
        (error, response, body) => {
            console.log("user from git : ",response.body);
            res.sendFile('dashboard.html', { root: path.join(__dirname, '../../views/') });
        }
    );
};

// save search data
exports.saveSearch = (req, res) => {
    if (req.session.access_token)
        res.cookie('access_token', req.session.access_token, { maxAge: 900000, httpOnly: true });
    let searchValue = req.query.gitsearch;
    getgituser(searchValue, req).then(function (record) {
        res.json({ "data": record });
    }).catch(function (err) {
        console.log(err);
        res.json({ "message": "Not found" });
    });
};

function getgituser(searchValue, req) {
    return new Promise(function (resolve, reject) {
        let url = config.gituserSearch.replace(':searchuser', searchValue);
        let requestObj = {
            url: url,
            headers: {
                'user-agent': 'node.js'
            }
        };
        request(requestObj, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let items=JSON.parse(response.body).items;
                resolve(JSON.parse(response.body));
            } else {
                reject(error);
            }
        });
    });
};