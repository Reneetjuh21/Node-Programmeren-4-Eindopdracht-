const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');

module.exports = {
    postNew(req, res, next) {
        res.contentType('application/json');

	    var insertedNaam = req.body.naam;
        var insertedBeschrijving = req.body.beschrijving;
        var insertedIngredienten = req.body.ingredienten;
        var insertedAllergie = req.body.allergie;
        var insertedPrijs = req.body.prijs;
        var insertedStudentId = req.params.id

        const authCode = req.headers.authorization;
        
	    db.query('INSERT INTO maaltijd (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)', [insertedNaam, insertedBeschrijving, insertedIngredienten, insertedAllergie, insertedPrijs, 1, insertedStudentId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
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
			res.status(200).json(rows);
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
			res.status(200).json(rows);
		}
	    });
    },

    putById(req, res, next) {

        var insertedNaam = req.body.naam;
        var insertedBeschrijving = req.body.beschrijving;
        var insertedIngredienten = req.body.ingredienten;
        var insertedAllergie = req.body.allergie;
        var insertedPrijs = req.body.prijs;
        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        res.contentType('application/json');
        db.query('UPDATE maaltijd SET naam = ? , beschrijving = ? , ingredienten = ? , allergie = ? , prijs = ? WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedNaam, insertedBeschrijving, insertedIngredienten, insertedAllergie, insertedPrijs, insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(200).json(rows);
            }
        });
    },

    deleteById(req, res, next) {
        res.contentType('application/json');

        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        db.query('DELETE FROM maaltijd WHERE maaltijd.StudentenhuisID = ? AND maaltijd.ID = ?', [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(200).json(rows);
            }
        });
    }
}