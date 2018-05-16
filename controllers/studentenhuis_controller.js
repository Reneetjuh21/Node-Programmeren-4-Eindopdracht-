const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');
const Studentenhuis = require('../models/studentenhuis');

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
                assert(typeof (req.body.adres) === 'string', 'Adres must be a string.')
            } catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                res.status(412).json(error);
        }

        // res.contentType('application/json');

	    var insertedNaam = req.body.naam;
        var insertedAdres = req.body.adres;
        
	    db.query('INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)', [insertedNaam, insertedAdres, userToken], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            var insertedId = rows.insertId;
            db.query('SELECT studentenhuis.ID, studentenhuis.Naam, studentenhuis.Adres, user.Voornaam, user.Achternaam, user.Email FROM studentenhuis LEFT JOIN user on studentenhuis.UserID = user.ID WHERE studentenhuis.ID = ? GROUP BY studentenhuis.ID', [insertedId], function(error, rows, fields) {
                var array = [];
                for(var i = 0; i < rows.length; i++){
                    var huis = new Studentenhuis(rows[i].ID, rows[i].Naam, rows[i].Adres,rows[0].Voornaam+' '+rows[0].Achternaam, rows[0].Email);
                    array.push(huis);
                }
                res.status(200).json(array);
            });
		};
	});
    },

    getAll(req, res, next) {
        // res.contentType('application/json');

	    db.query('SELECT studentenhuis.ID, studentenhuis.Naam, studentenhuis.Adres, user.Voornaam, user.Achternaam, user.Email FROM studentenhuis LEFT JOIN user on studentenhuis.UserID = user.ID GROUP BY studentenhuis.ID',  function(error, rows, fields) {
            var array = [];
            for(var i = 0; i < rows.length; i++){
                var huis = new Studentenhuis(rows[i].ID, rows[i].Naam, rows[i].Adres,rows[0].Voornaam+' '+rows[0].Achternaam, rows[0].Email);
                array.push(huis);
            }
            res.status(200).json(array);
        });
    },

    getById(req, res, next) {

        var studentenhuisId = req.params.id;

        // res.contentType('application/json');
        
	    db.query('SELECT studentenhuis.ID, studentenhuis.Naam, studentenhuis.Adres, user.Voornaam, user.Achternaam, user.Email FROM studentenhuis LEFT JOIN user on studentenhuis.UserID = user.ID WHERE studentenhuis.ID = ? GROUP BY studentenhuis.ID', [studentenhuisId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                const error = new api_error("Niet gevonden (huisId bestaat niet)", 404);
                res.status(404).json(error);
            } else {
                var array = [];
                for(var i = 0; i < rows.length; i++){
                    var huis = new Studentenhuis(rows[i].ID, rows[i].Naam, rows[i].Adres,rows[0].Voornaam+' '+rows[0].Achternaam, rows[0].Email);
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
            assert(typeof (req.body.adres) === 'string', 'Adres must be a string.')
        } catch (ex) {
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
            res.status(412).json(error);
        }

        var insertedNaam = req.body.naam;
        var insertedAdres = req.body.adres;
        var insertedId = req.params.id;

        // res.contentType('application/json');

        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length !== 0) {
                    if (rows[0].UserID !== userToken) {
                        const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                        res.status(409).json(error);
                    } else {
                        db.query('UPDATE studentenhuis SET naam = ? , Adres = ? WHERE ID = ?', [insertedNaam, insertedAdres, insertedId], function(error, rows, fields) {
                            if (error) {
                                res.status(400).json(error);
                                } else {
                                    db.query('SELECT studentenhuis.ID, studentenhuis.Naam, studentenhuis.Adres, user.Voornaam, user.Achternaam, user.Email FROM studentenhuis LEFT JOIN user on studentenhuis.UserID = user.ID WHERE studentenhuis.ID = ? GROUP BY studentenhuis.ID', [insertedId], function(error, rows, fields) {
                                        var array = [];
                                        for(var i = 0; i < rows.length; i++){
                                            var huis = new Studentenhuis(rows[i].ID, rows[i].Naam, rows[i].Adres, rows[i].UserID);
                                            array.push(huis);
                                        }
                                        res.status(200).json(array);
                                    });
                                }
                        }); 
                    }
                } else {
                    const error = new api_error("Niet gevonden (huisId bestaat niet)", 404);
                    res.status(404).json(error);
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
        var insertedId = req.params.id;
       
        // res.contentType('application/json');

        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (rows.length !== 0) {
                if (rows[0].UserID !== userToken) {
                    const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                    res.status(409).json(error);
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
                res.status(404).json(error);
            };
        });
    }
}