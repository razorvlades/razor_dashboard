const express = require('express');
const fetch = require("node-fetch");
// const cors = require('cors');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// router.use(cors());

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
    
    console.log(sortedLibraries.slice(0, 2));
    res.send(sortedLibraries.slice(0, 2));
});

module.exports = router;