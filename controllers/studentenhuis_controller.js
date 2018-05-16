const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');
const api_error = require('../models/apierror');
const Studentenhuis = require('../models/studentenhuis');

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
        //Geef de value van UserID van de bufferPayload mee aan userToken, deze wordt later gebruikt om te controleren WIE de postNew-methode uitvoert
        var userToken = bufferPayload.UserID;
        //Voer een check uit waarbij er wordt gekeken naar de ingoeverde body-waarden, beide moeten een string zijn
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
        
        //Voer een query uit waarbij de meegegeven body-waarden en userToken worden ingevuld in een tabel
	    db.query('INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)', [insertedNaam, insertedAdres, userToken], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            var insertedId = rows.insertId;
            //Als de vorige query is geslaagd, laat dan het toegevoegde studentenhuis zien met gebruikersinformatie
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
<<<<<<< HEAD
        res.contentType('application/json');
        //Voer een query uit waarbij alle studentenhuizen met gebruikersinformatie worden geretourneerd en weergegeven
=======
        // res.contentType('application/json');

>>>>>>> 53895c65aaa955b7f7bad69b5abb19847550aa2e
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

<<<<<<< HEAD
        res.contentType('application/json');
        //Voer een query uit waarbij een studentenhuis met gebruikersinformatie wordt geretourneerd en weergegeven op basis van de ID
=======
        // res.contentType('application/json');
        
>>>>>>> 53895c65aaa955b7f7bad69b5abb19847550aa2e
	    db.query('SELECT studentenhuis.ID, studentenhuis.Naam, studentenhuis.Adres, user.Voornaam, user.Achternaam, user.Email FROM studentenhuis LEFT JOIN user on studentenhuis.UserID = user.ID WHERE studentenhuis.ID = ? GROUP BY studentenhuis.ID', [studentenhuisId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
            if (rows.length == 0) {
                //Geen rows gevonden, dan bestaat het ID niet
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

        //Voer een query uit waarbij een studentenhuis wordt gertourneerd op basis van de ID
        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                //Als de results niet leeg zijn, controleer dan of de UserID van de row hetzelfde is als de userToken, zo niet, dan mag de gebruiker de data niet veranderen
                if (rows.length !== 0) {
                    if (rows[0].UserID !== userToken) {
                        const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                        res.status(409).json(error);
                    } else {
                        //Als de UserID en de userToken wel hetzelfde zijn, dan wordt er een query uitgevoerd om data in de row up te daten
                        db.query('UPDATE studentenhuis SET naam = ? , Adres = ? WHERE ID = ?', [insertedNaam, insertedAdres, insertedId], function(error, rows, fields) {
                            if (error) {
                                res.status(400).json(error);
                                } else {
                                    //Als de query succesvol is uitgevoerd, dan wordt er een nieuwe query uitgevoerd die de nieuwe data laat zien
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

        //Voer een query uit waarbij een studentenhuis wordt gertourneerd op basis van de ID
        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            //Check of de rows bestaan
            if (rows.length !== 0) {
                //Check of de ID van de gebruiker hetzelfde is als de ID waarmee de row was gemaakt
                if (rows[0].UserID !== userToken) {
                    const error = new api_error('Conflict (Gebruiker mag deze data niet wijzigen)', 409);
                    res.status(409).json(error);
                } else {
                    //Als alle checks zijn voldaan, verwijder dan de row met de ID die is meegegeven
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