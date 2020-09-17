const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

app.get('/getConfig', (req, res) => {
    const config = fs.readFileSync(__dirname + '/../src/config/config.json');
    res.send(config);
});

app.post('/updateConfig', (req, res) => {
    const config = req.body;
    fs.writeFileSync(__dirname + '/../src/config/config.json', JSON.stringify(config));
    res.send({ ok: true, config: config })
});

app.listen(9078);