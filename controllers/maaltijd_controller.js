const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');
const Maaltijd = require('../models/maaltijd');

module.exports = {

    postNew(req, res, next) {
        //Pak de meegegeven JWT-token uit de Authorization header
        var bufferPayload = '';
        const bufferToken = req.get('Authorization').substr(7);
        //Decode de token en geef de results door aan bufferPayload
        var decodedUserToken = auth.decodeToken(bufferToken, (err, payload) => {
            if (err) {
                const error = new api_error("Niet geautoriseerd (geen valid token)", 401);
                res.status(401).json(error);
            } else {
                bufferPayload = payload;
            }
        });
        //Geef de value van UserID van de bufferPayload mee aan userToken, deze wordt later gebruikt om in te vullen WIE de postNew-methode heeft uitgevoerd
        var userToken = bufferPayload.UserID;
        //Voer een check uit waarbij er wordt gekeken naar de ingoeverde body-waarden, beide moeten een string zijn
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
        var insertedStudentId = req.params.id;
        //Voer een query uit waarbij een studentenhuis wordt opgevraagd op basis van de ID
        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedStudentId], function(error, rows, fields) {
            //Check of de results bestaan
            if (rows.length == 0) {
                const error = new api_error('Niet gevonden (huisId bestaat niet)', 404);
                res.status(404).json(error);
            } else {
                //Als het wel bestaat, dan wordt er een nieuwe query uitgevoerd waarbij er een nieuwe row wordt ingevuld in de maaltijd-tabel met de meegegeven body-waarden, userToken en StudentenhuisID
                db.query('INSERT INTO maaltijd (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)', [insertedNaam, insertedBeschrijving, insertedIngredienten, insertedAllergie, insertedPrijs, userToken, insertedStudentId], function(error, rows, fields) {
                    if (error) {
                        res.status(400).json(error);
                    } else {
                        //Als de vorige query is geslaagd, laat dan met de volgende query de geupdate row zien
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
        //Voer een query uit waarbij er een maaltijd wordt opgehaald op basis van het meegegeven StudentenhuisID
	    db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ?', [insertedStudentId], function(error, rows, fields) {
		if (error) {
            res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                res.status(404).json(error);
            } else {
                //Wanneer de maaltijd is gevonden, wordt er een nieuw object of meerdere objecten aangemaakt en geretourneerd
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
        //Voer een query uit die een maaltijd opvraagt op basis van StudentenhuisID en maaltijdID
	    db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                res.status(404).json(error);
            } else {
                //Wanneer deze is gevonden wordt er een nieuwe Maaltijd-object geretourneerd
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
        //Vraag een maaltijd op van bepaalde Studentenhuis met bepaalde MaaltijdID
        db.query('SELECT * FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    //Wanneer maaltijd is gevonden, wordt er gekeken of de user deze maaltijd had aangemaakt, zo ja, dan mag de data gewijzigd worden
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
        //Hier wordt hetzelfde gedaan als de vorige endpoint, alleen wordt de maaltijd verwijderd en niet gewijzigd als hij ook aangemaakt was door dezelfde ID.
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