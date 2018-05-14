//
// ./api/authentication.routes.v1.js
//
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

const auth = require('../auth/authentication');
let authcontroller = require('../controllers/auth_controller')

//
// Hier gaat de gebruiker inloggen.
// Input: username en wachtwoord
// ToDo: 
//	 - zoek de username in de database, en vind het password dat opgeslagen is
// 	 - als user gevonden en password matcht, dan return valide token
//   - anders is de inlogpoging gefaald - geef foutmelding terug.
//
router.post('/login', authcontroller.login);

//
// Hier gaat de gebruiker registreren.
// Input: username en wachtwoord
// ToDo: 
//	 - zoek de username in de database
// 	 - achterhalen of de username al in gebruik is, zo niet kan een user aangemaakt worden
//   - anders is de registratiepoging gefaald - geef foutmelding terug.
//
router.post('/register', authcontroller.register);

// Hiermee maken we onze router zichtbaar voor andere bestanden. 
module.exports = router;