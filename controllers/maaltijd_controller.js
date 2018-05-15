const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');
const Maaltijd = require('../models/maaltijd');

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

        try {
                assert(typeof (req.body.naam) === 'string', 'Name must be a string.')
                assert(typeof (req.body.beschrijving) === 'string', 'Beschrijving must be a string.')
                assert(typeof (req.body.ingredienten) === 'string', 'Ingredienten must be a string.')
                assert(typeof (req.body.allergie) === 'string', 'Allergie must be a string.')
                assert(typeof (req.body.prijs) === 'number', 'Prijs must be a number.')
            } catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                res.status(412).json(error);
        }

        res.contentType('application/json');

	    var insertedNaam = req.body.naam;
        var insertedBeschrijving = req.body.beschrijving;
        var insertedIngredienten = req.body.ingredienten;
        var insertedAllergie = req.body.allergie;
        var insertedPrijs = req.body.prijs;
        var insertedStudentId = req.params.id

        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedStudentId], function(error, rows, fields) {
            if (rows.length == 0) {
                const error = new api_error('Niet gevonden (huisId bestaat niet)', 404);
                res.status(404).json(error);
            } else {
                db.query('INSERT INTO maaltijd (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)', [insertedNaam, insertedBeschrijving, insertedIngredienten, insertedAllergie, insertedPrijs, userToken, insertedStudentId], function(error, rows, fields) {
                    if (error) {
                        res.status(400).json(error);
                    } else {
                        var insertedId = rows.insertId;
                        db.query('SELECT * FROM maaltijd WHERE maaltijd.ID = ?', [insertedId], function(error, rows, fields) {
                            var array = [];
                            for(var i = 0; i < rows.length; i++){
                                var huis = new Maaltijd(rows[i].ID, rows[i].Naam, rows[i].Beschrijving,rows[0].Ingredienten,rows[0].Allergie, rows[0].Prijs);
                                array.push(huis);
                            }
                            res.status(200).json(array);
                        });
                    }
                });
            }
        });
    },

    getAll(req, res, next) {

        res.contentType('application/json');

        var insertedStudentId = req.params.id;

	    db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ?', [insertedStudentId], function(error, rows, fields) {
		if (error) {
            res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                const error = new api_error('Niet gevonden (huisId bestaat niet)', 404);
                res.status(404).json(error);
            } else {
                var array = [];
                for(var i = 0; i < rows.length; i++){
                    var huis = new Maaltijd(rows[i].ID, rows[i].Naam, rows[i].Beschrijving,rows[0].Ingredienten,rows[0].Allergie, rows[0].Prijs);
                    array.push(huis);
                }
                res.status(200).json(array);
            }
		}
	});
    },

    getById(req, res, next) {

        res.contentType('application/json');
        
        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

	    db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                res.status(404).json(error);
            } else {
                var array = [];
                for(var i = 0; i < rows.length; i++){
                    var huis = new Maaltijd(rows[i].ID, rows[i].Naam, rows[i].Beschrijving,rows[0].Ingredienten,rows[0].Allergie, rows[0].Prijs);
                    array.push(huis);
                }
                res.status(200).json(array);
            }
		}
	    });
    },

    putById(req, res, next) {

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
        
        try {
                assert(typeof (req.body.naam) === 'string', 'Name must be a string.')
                assert(typeof (req.body.beschrijving) === 'string', 'Beschrijving must be a string.')
                assert(typeof (req.body.ingredienten) === 'string', 'Ingredienten must be a string.')
                assert(typeof (req.body.allergie) === 'string', 'Allergie must be a string.')
                assert(typeof (req.body.prijs) === 'number', 'Prijs must be a number.')
            } catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                res.status(412).json(error);
        }

        var insertedNaam = req.body.naam;
        var insertedBeschrijving = req.body.beschrijving;
        var insertedIngredienten = req.body.ingredienten;
        var insertedAllergie = req.body.allergie;
        var insertedPrijs = req.body.prijs;
        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        res.contentType('application/json');

        db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    if (rows[0].UserID == userToken) {
                        db.query('UPDATE maaltijd SET naam = ? , beschrijving = ? , ingredienten = ? , allergie = ? , prijs = ? WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedNaam, insertedBeschrijving, insertedIngredienten, insertedAllergie, insertedPrijs, insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                            if (error) {
                                res.status(400).json(error);
                            } else {
                                db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                                    if (error) {
                                        res.status(400).json(error);
                                    } else {
                                        var array = [];
                                        for(var i = 0; i < rows.length; i++){
                                            var huis = new Maaltijd(rows[i].ID, rows[i].Naam, rows[i].Beschrijving,rows[0].Ingredienten,rows[0].Allergie, rows[0].Prijs);
                                            array.push(huis);
                                        }
                                        res.status(200).json(array);
                                    }
                                });
                            }
                        });
                    } else {
                        const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                        res.status(409).json(error);
                    }
                }
            }
        });
    },

    deleteById(req, res, next) {
        
        var bufferPayload = '';
        const bufferToken = req.get('Authorization').substr(7)

        var decodedUserToken = auth.decodeToken(bufferToken, (err, payload) => {
            if (err) {
                const error = new api_error("Niet geautoriseerd (geen valid token)", 401);
                res.status(401).json(error);
            } else {
                bufferPayload = payload;
            }
        });

        var userToken = bufferPayload.UserID;

        res.contentType('application/json');

        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    if (rows[0].UserID == userToken) {
                        db.query('DELETE FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                            if (error) {
                                res.status(400).json(error);
                            } else {
                                const error = new api_error('Maaltijd is succesvol verwijderd.', 200);
                                res.status(200).json(error);
                            }
                        });
                    } else {
                        const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                        res.status(409).json(error);
                    } 
                }
            }
        });
    }
}