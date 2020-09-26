const express = require('express');
const fetch = require("node-fetch");
const xmlrpc = require('xmlrpc');
const router = express.Router();
const xmlparser = require('fast-xml-parser');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/tautulli', async (req, res) => {
    const url = req.query.url;
    const api_key = req.query.api_key;

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
    const username = req.query.username;
    const password = req.query.password;

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
        if (error)
            res.send({ ok: false });
        client.methodCall('throttle.global_up.rate', [], (error, ul_value) => {
            if (error)
                res.send({ ok: false });
            res.send({ ok: true, data_left: dl_value / 1000000.0, data_right: ul_value / 1000000.0 })
        });
    });
});

router.get('/radarr', async (req, res) => {
    const url = req.query.url;
    const api_key = req.query.api_key;

    let fetch_url = `${url}/api/queue?apiKey=${api_key}`;
    let result = await fetch(fetch_url);
    let json = await result.json();
    
    const queue_length = json.length;

    fetch_url = `${url}/api/movie?apiKey=${api_key}`;
    result = await fetch(fetch_url);
    json = await result.json();
   
    let missing_count = 0;
    for (let movie of json) {
        if (!movie.hasFile)
            missing_count++;
    }

    res.send({ missing_count, queue_length });
});

router.get('/jellyfin', async (req, res) => {
    const url = req.query.url;
    const api_key = req.query.api_key;

    const fetch_url = `${url}/emby/Items/Counts`;
    const result = await fetch(fetch_url, {
        headers: {
            'X-MediaBrowser-Token': api_key
        }
    });

    const json = await result.json();

    res.send(json);
});

router.get('/netdata', async (req, res) => {
    const url = req.query.url;

    const fetch_url = `${url}/api/v1/info`;
    const result = await fetch(fetch_url);
    const json = await result.json();

    res.send(json);
});

router.get('/shoko', async (req, res) => {
    const url = req.query.url;
    const username = req.query.username;
    const password = req.query.password;

    const auth_url = req.query.url + '/api/auth';
    const auth_result = await fetch(auth_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "user": username,
            "pass": password,
            "device": "RazorDash"
        })
    });

    const auth_json = await auth_result.json();
    const api_key = auth_json.apikey;

    const fetch_url = `${url}/api/serie/count`;
    const result = await fetch(fetch_url, {
        headers: {
            'Content-Type': 'application/json',
            'apikey': api_key
        }
    });
    const json = await result.json();
    const series_count = json.count;
    
    const files_url = `${url}/api/file/count`;
    const files_result = await fetch(files_url, {
        headers: {
            'Content-Type': 'application/json',
            'apikey': api_key
        }
    });
    const files_json = await files_result.json();
    const files_count = files_json.count;

    res.send({ series_count, files_count });
});

router.get('/plex', async (req, res) => {
    const url = req.query.url;
    const api_key = req.query.api_key;

    const fetch_url = `${url}/library/sections?X-Plex-Token=${api_key}`;
    const result = await fetch(fetch_url);
    const xml = await result.text();

    const options = {
        attributeNamePrefix : "__",
        ignoreAttributes : false,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        parseTrueNumberOnly: false,
        arrayMode: false,
    };

    if (xmlparser.validate(xml) === true) { 
        const libraries = [];
        const json = xmlparser.parse(xml, options);

        for (let lib of json.MediaContainer.Directory) {
            libraries.push({ key: lib.__key, title: lib.__title });
        }
        
        for (let i = 0; i < libraries.length; i++) {
            const key = libraries[i].key;
            const fetch_url = `${url}/library/sections/${key}/all?X-Plex-Token=${api_key}`;
            const lib_result = await fetch(fetch_url);
            const lib_xml = await lib_result.text();
            if (xmlparser.validate(lib_xml) === true) { 
                const lib_json = xmlparser.parse(lib_xml, options);
                const size = lib_json.MediaContainer.__size
                libraries[i].size = size;
            }
        }

        const libs = libraries.sort((a, b) => {
            return Number(b.size) - Number(a.size);
        });

        return res.send({ ok: true, libraries: libs });
    }
    else {
        return res.send({ ok: false });
    } 
});

router.get('/portainer', async (req, res) => {
    const url = req.query.url;

    const fetch_url = req.query.url + '/api/status';
    const result = await fetch(fetch_url);
    const json = await result.json();

    if (json.err) {
        return res.send({ ok: true, data_left: { title: 'Status', content: 'Error' }, data_right: {} });
    }
    else {
        return res.send({ ok: true, data_left: { title: 'Status', content: 'OK' }, data_right: { title: 'Version', content: json.Version } });
    }
});

module.exports = router;