const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/contests", async (req, res) => {
    try {
        const response = await axios.get(
            'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all',
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching contests:", error);
        res.status(500).json({
            message: "Error fetching contests",
            error: error.message
        });
    }
});

module.exports = router; 