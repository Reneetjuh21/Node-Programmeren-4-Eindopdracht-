const assert = require('assert')
const auth = require('../auth/authentication.js');
const db = require('../config/db');

module.exports = {
    postNew(req, res, next) {
        res.contentType('application/json');
	    var insertedNaam = req.body.naam;
	    var insertedAdres = req.body.adres;
	    const authCode = req.headers.authorization;
	    db.query('INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)', [insertedNaam, insertedAdres, 1], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
		}
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
			res.status(200).json(rows);
		}
	    });
    },

    putById(req, res, next) {
        var insertedNaam = req.body.naam;
        var insertedAdres = req.body.adres;
        var insertedId = req.params.id;
        res.contentType('application/json');
        db.query('UPDATE studentenhuis SET naam = ? , Adres = ? WHERE ID = ?', [insertedNaam, insertedAdres, insertedId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(200).json(rows);
            }
        });
    },

    deleteById(req, res, next) {
        var insertedId = req.params.id;
        res.contentType('application/json');
        db.query('DELETE FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(200).json(rows);
            }
        });
    }
}