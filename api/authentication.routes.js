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
			for (var i = 0; i <= rows.length; i++){
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
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;

    if (firstname == '' || lastname == '' || email == '' || password == ''){
        res.status(412).json({ "error": "Een of meer properties in de request body ontbreken of zijn foutief" });
    } else {
        db.query('SELECT ID, Email FROM user WHERE Email = ?',[ email], function(error, rows, fields) {
            if(error){
                res.status(400).json(error);
            } else {
                if (rows.length == 0){
                    db.query('INSERT INTO `user`(`Voornaam`, `Achternaam`, `Email`, `Password`) VALUES (?, ?, ?, ?)',[ firstname, lastname, email, password], function(error, rows, fields) {
                        if(error){
                            res.status(400).json(error);
                        } else {
                            var token = auth.encodeToken(email);
                            res.status(200).json({
                                "token": token,
                                "email": email
                            });
                        }
                    });  
                } else {
                    for (var i = 0; i < rows.length; i++){
                        var db_email = rows[i].Email;
        
                        if (email == db_email) {
                            res.status(401).json({ "error": "De gebruiker die u probeert toe te voegen, gebruikt een emailadres dat al bekend is in onze database. Gebruik een andere." });
                        } else {
                            db.query('INSERT INTO `user`(`Voornaam`, `Achternaam`, `Email`, `Password`) VALUES (?, ?, ?, ?)',[ firstname, lastname, email, password], function(error, rows, fields) {
                                if(error){
                                    res.status(400).json(error);
                                } else {
                                    var token = auth.encodeToken(email);
                                    res.status(200).json({
                                        "token": token,
                                        "email": email
                                    });
                                }
                            });
                        }
                    } 
                }
            }
        });
    }
});

// Hiermee maken we onze router zichtbaar voor andere bestanden. 
module.exports = router;