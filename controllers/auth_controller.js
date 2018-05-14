const assert = require('assert')
const auth = require('../auth/authentication')
const db = require('../config/db');
const bcrypt = require('bcrypt')

module.exports = {

    login(req, res, next) {
        // Even kijken wat de inhoud is
        console.dir(req.body);

        // De username en pwd worden meegestuurd in de request body
        try {
            assert(typeof (req.body.email) === 'string', 'email must be a string.');
            assert(typeof (req.body.password) === 'string', 'password must be a string.');
        }
        catch (ex) {
            const error = res.status(412).json({ "error": "Een of meer properties in de request body ontbreken of zijn foutief" });
            next(error);
            return
        }
        var email = req.body.email;
        var password = req.body.password;

        db.query('SELECT ID, Email, Password FROM user WHERE Email = ?',[email], function(error, rows, fields) {
            if (error) { 
                res.status(401).json({ "error": "Invalid credentials" });
            } else {
                for (var i = 0; i < rows.length; i++){
                    var db_email = rows[i].Email;
                    var db_password = rows[i].Password;
    
                    // Kijk of de gegevens matchen. Zo ja, dan token genereren en terugsturen.
                    if (email == db_email) {
                        if (bcrypt.compareSync(password, db_password)){
                            var token = auth.encodeToken(email);
                            res.status(200).json({
                                "token": token,
                                "email": email
                            });
                        } else {
                            res.status(401).json({ "error": "Invalid credentials" });
                        }
                    } else {
                        res.status(401).json({ "error": "Invalid credentials" });
                    }
                }
            }
        });
    },

    register(req, res, next){
    // Even kijken wat de inhoud is
    console.dir(req.body);

    try {
        assert(typeof (req.body.firstname) === 'string', 'firstname must be a string.')
        assert(typeof (req.body.lastname) === 'string', 'lastname must be a string.')
        assert(typeof (req.body.email) === 'string', 'email must be a string.')
        assert(typeof (req.body.password) === 'string', 'password must be a string.')
    }
    catch (ex) {
        const error = res.status(412).json({ "error": "Een of meer properties in de request body ontbreken of zijn foutief" });
        next(error)
        return
    }

    // De username en pwd worden meegestuurd in de request body
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;


    db.query('SELECT ID, Email FROM user WHERE Email = ?',[ email], function(error, rows, fields) {
            if(error){
                res.status(400).json(error);
            } else {
                if (rows.length == 0){
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        var encryptedpassword = hash;
                        db.query('INSERT INTO `user`(`Voornaam`, `Achternaam`, `Email`, `Password`) VALUES (?, ?, ?, ?)',[ firstname, lastname, email, encryptedpassword], function(error, rows, fields) {
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
                    });
                } else {
                    for (var i = 0; i < rows.length; i++){
                        var db_email = rows[i].Email;
        
                        if (email == db_email) {
                            res.status(401).json({ "error": "De gebruiker die u probeert toe te voegen, gebruikt een emailadres dat al bekend is in onze database. Gebruik een andere." });
                        } else {
                            const saltRounds = 10;
                            bcrypt.hash(password, saltRounds, function(err, hash) {
                                var encryptedpassword = hash;
                                db.query('INSERT INTO `user`(`Voornaam`, `Achternaam`, `Email`, `Password`) VALUES (?, ?, ?, ?)',[ firstname, lastname, email, encryptedpassword], function(error, rows, fields) {
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
                            });
                        }
                    } 
                }
            }
        });
    }
}