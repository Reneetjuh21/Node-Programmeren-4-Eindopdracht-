const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');

module.exports = {
    postNew(req, res, next) {
        const userToken = req.get('Authorization');
        var subUserToken = userToken.substr(7);
        var decodedUserToken = auth.decodeToken(subUserToken, (err, payload) => {
            if (err) {
                const error = new api_error("Niet geautoriseerd (geen valid token)", 401);
                next(error);
            } else {
                console.log(payload);
                return;
            }
        });
        //To-do: check ID of payload, use it to create a new row.
        try {
                assert(typeof (req.body.naam) === 'string', 'Name must be a string.')
                assert(typeof (req.body.adres) === 'string', 'Adres must be a string.')
            } catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                next(error);
                return;
        }
        res.contentType('application/json');
	    var insertedNaam = req.body.naam;
	    var insertedAdres = req.body.adres;
	    db.query('INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)', [insertedNaam, insertedAdres, 1], function(error, rows, fields) {
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
        const userToken = req.get('Authorization');
        var subUserToken = userToken.substr(7);
        var decodedUserToken = auth.decodeToken(subUserToken, (err, payload) => {
            if (err) {
                res.status(400).json(err);
            } else {
                console.log(payload);
            }
        });
        //To-do: check ID of payload, if ID was used to create the row, then continue. & add 409 conflict error.
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
                    db.query('UPDATE studentenhuis SET naam = ? , Adres = ? WHERE ID = ?', [insertedNaam, insertedAdres, insertedId], function(error, rows, fields) {
                        if (error) {
                            res.status(400).json(error);
                        } else {
                            db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
                                res.status(200).json(rows);
                            });
                        }
                    });
                } else {
                    const error = new api_error("Niet gevonden (huisId bestaat niet)", 404);
                    next(error);
                }
            }
        });
    },

    deleteById(req, res, next) {
        const userToken = req.get('Authorization');
        var subUserToken = userToken.substr(7);
        var decodedUserToken = auth.decodeToken(subUserToken, (err, payload) => {
            if (err) {
                res.status(400).json(err);
            } else {
                console.log(payload);
            }
        });
        //To-do: check ID of payload, if ID was used to create the row, then continue.
        var insertedId = req.params.id;
        res.contentType('application/json');
        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (rows.length !== 0) {
                db.query('DELETE FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
                    if (error) {
                        res.status(400).json(error);
                    } else {
                        const error = new api_error('Studentenhuis is succesvol verwijderd.', 200);
                        res.status(200).json(error);
                    }
                });
            } else {
                const error = new api_error('Niet gevonden (huisId bestaat niet)', 404);
                next(error);
            };
        });
        
    }
}