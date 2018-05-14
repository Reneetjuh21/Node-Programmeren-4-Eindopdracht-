//
// ./api/authentication.routes.v1.js
//
var express = require('express');
var router = express.Router();
var db = require('../config/db');

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
    var email = req.body.email;
    var password = req.body.password;

    //Users ophalen uit de database
    db.query('SELECT ID, Email, Password FROM user WHERE Email = ?',[ email], function(error, rows, fields) {
        if (error) { 
			res.status(412).json({ "error": "Een of meer properties in de request body ontbreken of zijn foutief" });
		} else {
			for (var i = 0; i < rows.length; i++){
                var db_email = rows[i].Email;
                var db_password = rows[i].Password;

                // Kijk of de gegevens matchen. Zo ja, dan token genereren en terugsturen.
                if (email == db_email && password == db_password) {
                    var token = auth.encodeToken(email);
                    res.status(200).json({
                        "token": token,
                        "email": email
                    });
                } else {
                    res.status(412).json({ "error": "Een of meer properties in de request body ontbreken of zijn foutief" });
                }
            }
		}
    });
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