//
// ./api/routes_v2.js
//
var express = require('express');
var routes = express.Router();
var db = require('../config/db');
var auth = require('../auth/authentication.js');
var config = require('../config/config.json')

routes.post('/studentenhuis', function(req, res){
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
});

routes.get('/studentenhuis', function(req, res){
	res.contentType('application/json');
	db.query('SELECT * FROM studentenhuis', function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
		}
	});
});

routes.get('/studentenhuis/:id', function(req, res){
	var studentenhuisId = req.params.id;
	res.contentType('application/json');
	db.query('SELECT * FROM studentenhuis WHERE ID = ?', [studentenhuisId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
		}
	});
});

routes.put('/studentenhuis/:id', function(req, res){
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
});

routes.delete('/studentenhuis/:id', function(req, res){
	var insertedId = req.params.id;
	res.contentType('application/json');
	db.query('DELETE FROM studentenhuis WHERE ID = ?', [insertedId], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
		} else {
			res.status(200).json(rows);
		}
	});
});

module.exports = routes;