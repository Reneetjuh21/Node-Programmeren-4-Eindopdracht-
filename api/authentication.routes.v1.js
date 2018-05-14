//
// ./api/authentication.routes.v1.js
//
var express = require('express');
var router = express.Router();

var auth = require('../auth/authentication');

//
// Hier gaat de gebruiker inloggen.
// Input: username en wachtwoord
// ToDo: 
//	 - zoek de username in de database, en vind het password dat opgeslagen is
// 	 - als user gevonden en password matcht, dan return valide token
//   - anders is de inlogpoging gefaald - geef foutmelding terug.
//
router.post('/login', function(req, res) {

    // Even kijken wat de inhoud is
    console.dir(req.body);

    // De username en pwd worden meegestuurd in de request body
    var username = req.body.username;
    var password = req.body.password;

    //Users ophalen uit de database
    db.query('SELECT * FROM user', function(error, rows, fields) {
        if (error) { 
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
		};
    });

    // Kijk of de gegevens matchen. Zo ja, dan token genereren en terugsturen.
    // if (username == db_username && password == db_password) {
    //     var token = auth.encodeToken(username);
    //     res.status(200).json({
    //         "token": token,
    //     });
    // } else {
    //     res.status(401).json({ "error": "Invalid credentials, bye" })
    // }

});

//
// Hier gaat de gebruiker registreren.
// Input: username en wachtwoord
// ToDo: 
//	 - zoek de username in de database
// 	 - achterhalen of de username al in gebruik is, zo niet kan een user aangemaakt worden
//   - anders is de registratiepoging gefaald - geef foutmelding terug.
//
router.post('/register', function(req, res) {

    // Even kijken wat de inhoud is
    console.dir(req.body);

    // De username en pwd worden meegestuurd in de request body
    var username = req.body.username;
    var password = req.body.password;

    // Dit is een dummy-user - die haal je natuurlijk uit de database.
    var _dummy_username = "test";
    var _dummy_password = "test";

    // Kijk of de username al in gebruik is genomen
    if (username == _dummy_username) {
        // var token = auth.encodeToken(username);
        // res.status(200).json({
        //     "token": token,
        // });
    } else {
        res.status(401).json({ "error": "Username already in use, bye" })
    }

});

// Hiermee maken we onze router zichtbaar voor andere bestanden. 
module.exports = router;