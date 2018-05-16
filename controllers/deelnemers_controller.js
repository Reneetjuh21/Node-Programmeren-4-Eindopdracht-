const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');
const Deelnemer = require('../models/deelnemer');

module.exports = {
    
    postNew(req, res, next) {
        var bufferPayload = '';
        const bufferToken = req.get('Authorization').substr(7);

        var decodedUserToken = auth.decodeToken(bufferToken, (err, payload) => {
            if (err) {
                const error = new api_error("Niet geautoriseerd (geen valid token)", 401);
                res.status(401).json(error);
            } else {
                bufferPayload = payload;
            }
        });
        
        var userToken = bufferPayload.UserID;
        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;
        //Er wordt een query uitgevoerd waar een maaltijd wordt opgevraagd op basis van StudentenhuisID en MaaltijdID
        db.query('SELECT * FROM maaltijd WHERE StudentenhuisID = ? AND ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    db.query('SELECT * FROM deelnemers WHERE StudentenhuisID = ? AND maaltijdID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                        if (error) {
                            res.status(400).json(error);
                        } else {
                            if (rows.length !== 0) {
                                if (rows[0].UserID == userToken) {
                                    const error = new api_error('Conflict (Gebruiker is al aangemeld)', 409);
                                    res.status(404).json(error);
                                } else {
                                    //Als de maaltijd bestaat, wordt er een nieuwe gebruiker met de userToken toegevoegd aan tabel deelnemers (van de maaltijd)
                                    db.query('INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?, ?)', [userToken, insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                                        if (error) {                              
                                            res.status(400).json(error);
                                        } else {
                                            //Als datis gelukt, laat dan gebruikersinformatie zien over de toegevoegde deelnemer
                                            db.query('SELECT Voornaam, Achternaam, Email FROM user WHERE ID = ?', [userToken], function(error, rows, fields) {
                                                if (error) {
                                                    res.status(400).json(error);
                                                } else {
                                                    var maaltijdDeelnemer = new Deelnemer(rows[0].Voornaam, rows[0].Achternaam, rows[0].Email);
                                                    res.status(200).json(maaltijdDeelnemer);
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                //Dit wordt er uitgevoerd wanneer er nog geen deelnemers zijn
                                db.query('INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?, ?)', [userToken, insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                                    if (error) {                              
                                        res.status(400).json(error);
                                    } else {
                                        db.query('SELECT Voornaam, Achternaam, Email FROM user WHERE ID = ?', [userToken], function(error, rows, fields) {
                                            if (error) {
                                                res.status(400).json(error);
                                            } else {
                                                var maaltijdDeelnemer = new Deelnemer(rows[0].Voornaam, rows[0].Achternaam, rows[0].Email);
                                                res.status(200).json(maaltijdDeelnemer);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },

    getAll(req, res, next) {

        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;
        //Er wordt een query uitgevoerd die alle deelnemers teruggeeft die deelnemen aan maaltijd met het gegeven StudentenhuisID en MaaltijdID
        db.query('SELECT * FROM view_deelnemers WHERE StudentenhuisID = ? AND MaaltijdID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    var array = [];
                    for (var i = 0; i < rows.length; i++) {
                        var maaltijdDeelnemer = new Deelnemer(rows[i].Voornaam, rows[i].Achternaam, rows[i].Email);
                        array.push(maaltijdDeelnemer);
                    }
                res.status(200).json(array);
                }
            }
        });
    },

    deleteById(req, res, next) {

        var bufferPayload = '';
        const bufferToken = req.get('Authorization').substr(7);

        var decodedUserToken = auth.decodeToken(bufferToken, (err, payload) => {
            if (err) {
                const error = new api_error("Niet geautoriseerd (geen valid token)", 401);
                res.status(401).json(error);
            } else {
                bufferPayload = payload;
            	 }
            });

        var userToken = bufferPayload.UserID;
        var deletedUser = false;
        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;
        //Er wordt een query uitgevoerd waarbij een deelnemer wordt verwijderd als de userToken van deze deelnemer in de lijst met deelnemers bestaat
        db.query('SELECT * FROM deelnemers WHERE StudentenhuisID = ? AND MaaltijdID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].UserID == userToken) {
                            db.query('DELETE FROM deelnemers WHERE UserID = ?', [userToken], function(error, rows, fields) {
                                if (error) {
                                    res.status(400).json(error);
                                } else {
                                    deletedUser = true;
                                    const error = new api_error('Deelnemer is succesvol van de maaltijd verwijderd.', 200);
                                    res.status(200).json(error);
                                }
                            });
                        }
                    }
                    if (!deletedUser) {
                        const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                        res.status(409).json(error);
                    }
                }
            }
        });
    }
}