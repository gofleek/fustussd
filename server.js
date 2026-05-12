const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
=====================================================
NEWS API
=====================================================
*/

const NEWS_API =
"https://script.google.com/macros/s/AKfycbyoOkRYyXnodJiuoc-ZIKQWY1XhhTlKV8beGHIF0wTdP0EX2yP8rAmXpcAnkmYAXagT/exec";

/*
=====================================================
FETCH NEWS
=====================================================
*/

async function fetchNews() {
    try {
        const res = await axios.get(NEWS_API);
        return res.data;
    } catch (err) {
        console.log("API Error:", err.message);
        return [];
    }
}

/*
=====================================================
USSD ENDPOINT
=====================================================
*/

app.post("/ussd", async (req, res) => {

    const text = (req.body.text || "").trim();

    res.set("Content-Type", "text/plain");

    /*
    =======================
    MAIN MENU
    =======================
    */

    if (text === "") {

        return res.send(
`CON Welcome to Newsroom
1. Latest News
2. Sports
3. Technology
4. Entertainment
5. Exit`
        );
    }

    /*
    =======================
    LATEST NEWS
    =======================
    */

    if (text === "1") {

        const news = await fetchNews();

        if (!news.length) return res.send("END No news available");

        let response = "CON Latest News\n";

        news.slice(0, 5).forEach((item, i) => {

            const title = item.short_title || "No title";
            const story = item.short_story || "";

            response += `${i + 1}. ${title}\n`;
            response += `${story.substring(0, 40)}...\n\n`;
        });

        response += "0. Back";

        return res.send(response);
    }

    /*
    =======================
    SPORTS
    =======================
    */

    if (text === "2") {

        const news = await fetchNews();
        const filtered = news.filter(n => n.category === "sports");

        let response = "CON Sports News\n";

        filtered.slice(0, 5).forEach((item, i) => {

            response += `${i + 1}. ${item.short_title}\n`;
            response += `${(item.short_story || "").substring(0, 40)}...\n\n`;
        });

        response += "0. Back";

        return res.send(response);
    }

    /*
    =======================
    TECHNOLOGY
    =======================
    */

    if (text === "3") {

        const news = await fetchNews();
        const filtered = news.filter(n => n.category === "technology");

        let response = "CON Technology News\n";

        filtered.slice(0, 5).forEach((item, i) => {

            response += `${i + 1}. ${item.short_title}\n`;
            response += `${(item.short_story || "").substring(0, 40)}...\n\n`;
        });

        response += "0. Back";

        return res.send(response);
    }

    /*
    =======================
    ENTERTAINMENT
    =======================
    */

    if (text === "4") {

        const news = await fetchNews();
        const filtered = news.filter(n => n.category === "entertainment");

        let response = "CON Entertainment News\n";

        filtered.slice(0, 5).forEach((item, i) => {

            response += `${i + 1}. ${item.short_title}\n`;
            response += `${(item.short_story || "").substring(0, 40)}...\n\n`;
        });

        response += "0. Back";

        return res.send(response);
    }

    /*
    =======================
    EXIT
    =======================
    */

    if (text === "5") {
        return res.send("END Thank you for using Newsroom");
    }

    /*
    =======================
    BACK
    =======================
    */

    if (
        text === "1*0" ||
        text === "2*0" ||
        text === "3*0" ||
        text === "4*0"
    ) {
        return res.send(
`CON Welcome to Newsroom
1. Latest News
2. Sports
3. Technology
4. Entertainment
5. Exit`
        );
    }

    return res.send("END Invalid choice");
});

/*
=====================================================
START SERVER
=====================================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("USSD Server running on port", PORT);
});
