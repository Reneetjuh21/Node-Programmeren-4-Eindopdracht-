const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');

module.exports = {

    postNew(req, res, next) {
        var bufferPayload = '';
        const bufferToken = req.get('Authorization').substr(7);

        var decodedUserToken = auth.decodeToken(bufferToken, (err, payload) => {
            if (err) {
                const error = new api_error("Niet geautoriseerd (geen valid token)", 401);
                next(error);
            } else {
                bufferPayload = payload;
            	 }
            });

        var userToken = bufferPayload.userID;
        console.log(userToken);

        try {
                assert(typeof (req.body.naam) === 'string', 'Name must be a string.')
                assert(typeof (req.body.adres) === 'string', 'Adres must be a string.')
            } catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                next(error);
        }

        res.contentType('application/json');

	    var insertedNaam = req.body.naam;
        var insertedAdres = req.body.adres;
        
	    db.query('INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)', [insertedNaam, insertedAdres, userToken], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            var insertedId = rows.insertId;
            db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
                res.status(200).json(rows);
            });
		};
	});
    },

    getAll(req, res, next) {

        res.contentType('application/json');

	    db.query('SELECT * FROM studentenhuis', function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
		}
	});
    },

    getById(req, res, next) {

        var studentenhuisId = req.params.id;

        res.contentType('application/json');
        
	    db.query('SELECT * FROM studentenhuis WHERE ID = ?', [studentenhuisId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                const error = new api_error("Niet gevonden (huisId bestaat niet)", 404);
                next(error);
            } else {
                res.status(200).json(rows);
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
                next(error);
            } else {
                bufferPayload = payload;
                return;
            }
        });
      
        var userToken = bufferPayload.userID;

        try {
            assert(typeof (req.body.naam) === 'string', 'Name must be a string.')
            assert(typeof (req.body.adres) === 'string', 'Adres must be a string.')
        } catch (ex) {
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
            next(error);
            return;
        }

        var insertedNaam = req.body.naam;
        var insertedAdres = req.body.adres;
        var insertedId = req.params.id;

        res.contentType('application/json');

        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length !== 0) {
                    if (rows[0].UserID !== userToken) {
                        const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                        next(error);
                    } else {
                        db.query('UPDATE studentenhuis SET naam = ? , Adres = ? WHERE ID = ?', [insertedNaam, insertedAdres, insertedId], function(error, rows, fields) {
                            if (error) {
                                res.status(400).json(error);
                                } else {
                                    db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
                                        res.status(200).json(rows);
                                    });
                                }
                        }); 
                    }
                } else {
                    const error = new api_error("Niet gevonden (huisId bestaat niet)", 404);
                    next(error);
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
                next(error);
            } else {
                bufferPayload = payload;
                return;
            }
        });
        
        var userToken = bufferPayload.userID;
        var insertedId = req.params.id;
       
        res.contentType('application/json');

        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (rows.length !== 0) {
                if (rows[0].UserID !== userToken) {
                    const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                    next(error);
                } else {
                    db.query('DELETE FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
                        if (error) {
                            res.status(400).json(error);
                        } else {
                            const error = new api_error('Studentenhuis is succesvol verwijderd.', 200);
                            res.status(200).json(error);
                        }
                    });
                } 
            } else {
                const error = new api_error('Niet gevonden (huisId bestaat niet)', 404);
                next(error);
            };
        });
    }
}