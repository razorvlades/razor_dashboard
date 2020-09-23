const express = require('express');
const fetch = require("node-fetch");
const xmlrpc = require('xmlrpc');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/tautulli', async (req, res) => {
    const url = req.query.url;
    const api_key = process.env.TAUTULLI_API_KEY;
    const fetch_url = `${url}/api/v2?apikey=${api_key}&cmd=get_libraries`;
    const response = await fetch(fetch_url);
    const json = await response.json();
    const libraries = json.response.data;

    const sortedLibraries = libraries.sort((a, b) => {
        return (Number(b.count) - Number(a.count));
    });
    
    res.send(sortedLibraries.slice(0, 2));
});

router.get('/rutorrent', async (req, res) => {
    const url = req.query.url;
    const ssl = url.includes('https');
    const ip = url.split('/')[2].split(':')[0];
    const port = url.split('/')[2].split(':')[1];
    const username = process.env.RUTORRENT_USERNAME;
    const password = process.env.RUTORRENT_PASSWORD;

    const options = {
        host: ip,
        port: port,
        path: '/RPC2',
        headers: {
            'User-Agent': 'RazorDash',
            'Content-Type': 'text/xml',
            'Accept': 'text/xml',
            'Accept-Charset': 'UTF8',
            'Connection': 'Close',
        },
        basic_auth: {
            user: username,
            pass: password
        }
    }

    const client = ssl ? xmlrpc.createSecureClient(options) : xmlrpc.createClient(options);
    client.methodCall('throttle.global_down.rate', [], (error, dl_value) => {
        client.methodCall('throttle.global_up.rate', [], (error, ul_value) => {
            res.send({ data_left: dl_value / 1000000.0, data_right: ul_value / 1000000.0 })
        });
    });
});

module.exports = router;