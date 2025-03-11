const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/get', (req, res) => {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN
    axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.error('Error fetching contributors:', error);
            res.status(500).json({ error: 'Error fetching contributors' });
        });
} );

module.exports = router;
