const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
=====================================================
DATABASE CONNECTION (InfinityFree MySQL)
=====================================================
*/

const db = mysql.createConnection({
    host: "sql201.infinityfree.com",
    user: "if0_41707302",
    password: "J2GvaCwZvzhg4",
    database: "if0_41707302_newsroom"
});

db.connect((err) => {
    if (err) {
        console.log("DB Error:", err.message);
    } else {
        console.log("Database Connected");
    }
});

/*
=====================================================
USSD ENDPOINT
=====================================================
*/

app.post("/ussd", (req, res) => {

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

        db.query(
            "SELECT title FROM news ORDER BY id DESC LIMIT 5",
            (err, results) => {

                if (err) {
                    return res.send("END Database error");
                }

                let response = "CON Latest News\n";

                results.forEach((row, i) => {
                    response += `${i + 1}. ${row.title.substring(0, 50)}\n`;
                });

                response += "0. Back";

                res.send(response);
            }
        );

        return;
    }

    /*
    =======================
    SPORTS
    =======================
    */

    if (text === "2") {

        db.query(
            "SELECT title FROM news WHERE category='sports' ORDER BY id DESC LIMIT 5",
            (err, results) => {

                if (err) {
                    return res.send("END Database error");
                }

                let response = "CON Sports News\n";

                results.forEach((row, i) => {
                    response += `${i + 1}. ${row.title.substring(0, 50)}\n`;
                });

                response += "0. Back";

                res.send(response);
            }
        );

        return;
    }

    /*
    =======================
    TECHNOLOGY
    =======================
    */

    if (text === "3") {

        db.query(
            "SELECT title FROM news WHERE category='technology' ORDER BY id DESC LIMIT 5",
            (err, results) => {

                if (err) {
                    return res.send("END Database error");
                }

                let response = "CON Technology News\n";

                results.forEach((row, i) => {
                    response += `${i + 1}. ${row.title.substring(0, 50)}\n`;
                });

                response += "0. Back";

                res.send(response);
            }
        );

        return;
    }

    /*
    =======================
    ENTERTAINMENT
    =======================
    */

    if (text === "4") {

        db.query(
            "SELECT title FROM news WHERE category='entertainment' ORDER BY id DESC LIMIT 5",
            (err, results) => {

                if (err) {
                    return res.send("END Database error");
                }

                let response = "CON Entertainment News\n";

                results.forEach((row, i) => {
                    response += `${i + 1}. ${row.title.substring(0, 50)}\n`;
                });

                response += "0. Back";

                res.send(response);
            }
        );

        return;
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
    BACK TO MENU
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

    /*
    =======================
    INVALID
    =======================
    */

    return res.send("END Invalid choice");
});

/*
=====================================================
START SERVER (RENDER USES PORT ENV)
=====================================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("USSD Server running on port", PORT);
});
