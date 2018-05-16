const assert = require('assert');
const User = require('../models/user');
const auth = require('../auth/authentication');
const db = require('../config/db');
const api_error = require('../models/apierror');
const bcrypt = require('bcrypt');
const usercontrol = require('./user_controller');
const validator = require("email-validator");

module.exports = {

    login(req, res, next) {

        var email = req.body.email;
        var password = req.body.password;

        // De username en pwd worden meegestuurd in de request body
        try {
            assert(typeof (email) === 'string', 'email must be a string.');
            assert(typeof (password) === 'string', 'password must be a string.');
            validator.validate(email);
        }
        catch (ex) {
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
            next(error);
        }

        db.query('SELECT ID, Email, Password FROM user WHERE Email = ?',[email], function(err, rows, fields) {
            if (err) { 
                const error = new api_error("Invalid credentials", 401);
                next(error);
            }else if(rows.length == 0) {
                const error = new api_error("Invalid credentials", 401);
                next(error);
            } else {
                for (var i = 0; i < rows.length; i++){
                    var db_email = rows[i].Email;
                    var db_password = rows[i].Password;
    
                    // Kijk of de gegevens matchen. Zo ja, dan token genereren en terugsturen.
                    if (email == db_email) {
                        if (bcrypt.compareSync(password, db_password)){

                            var token = auth.encodeToken(email, rows[i].ID);
                            res.status(200).json({
                                "token": token,
                                "email": email
                            });
                        } else {
                            const error = new api_error("Invalid credentials", 401);
                            next(error);
                        }
                    } else {
                        const error = new api_error("Invalid credentials", 401);
                        next(error);
                    }
                }
            }
        });
    },

    register(req, res, next){
        // De username en pwd worden meegestuurd in de request body
        const user = usercontrol.createUser(req, res, next);

        db.query('SELECT ID, Email FROM user WHERE Email = ?',[user.email], function(error, rows, fields) {
            if(error){
                next(error);
            } else {
                if (rows.length == 0){
                    const saltRounds = 10;
                    bcrypt.hash(user.password, saltRounds, function(err, hash) {
                        var encryptedpassword = hash;
                        db.query('INSERT INTO `user`(`Voornaam`, `Achternaam`, `Email`, `Password`) VALUES (?, ?, ?, ?)',[ user.firstname, user.lastname, user.email, encryptedpassword], function(error, rows, fields) {
                            if(error){
                                next(error);
                            } else {
                                var token = auth.encodeToken(user.email, rows.insertId);
                                res.status(200).json({
                                    "token": token,
                                    "email": user.email
                                });
                            }
                        }); 
                    });
                } else {
                    for (var i = 0; i < rows.length; i++){
                        var db_email = rows[i].Email;
                        if (user.email == db_email) {
                            const error = new api_error("De gebruiker die u probeert toe te voegen, gebruikt een emailadres dat al bekend is in onze database. Gebruik een andere.", 401)
                            next(error)
                        } else {
                            const saltRounds = 10;
                            bcrypt.hash(user.password, saltRounds, function(err, hash) {
                                var encryptedpassword = hash;
                                db.query('INSERT INTO `user`(`Voornaam`, `Achternaam`, `Email`, `Password`) VALUES (?, ?, ?, ?)',[ user.firstname, user.lastname, user.email, encryptedpassword], function(error, rows, fields) {
                                    if(error){
                                        next(error);
                                    } else {
                                        var token = auth.encodeToken(user.email, rows.insertId);
                                        res.status(200).json({
                                            "token": token,
                                            "email": user.email
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