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
                res.status(401).json(error);
            } else {
                bufferPayload = payload;
            }
        });
        
        var userToken = bufferPayload.UserID;
        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        db.query('SELECT * FROM deelnemers WHERE deelnemers.StudentenhuisID = ? AND deelnemers.MaaltijdID = ?' [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    if (rows[0].UserID == userToken) {
                        const error = new api_error('Conflict (Gebruiker is al aangemeld)', 409);
                        res.status(404).json(error);
                    } else {
                        db.query('INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?, ?)' [userToken, insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
                            if (error) {
                                res.status(404).json(error);
                            } else {
                                //To-do: return correct model
                            }
                        });
                    }
                }
            }
        });
    },

    getAll(req, res, next) {

        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        db.query('SELECT * FROM deelnemers WHERE deelnemers.StudentenhuisID = ? AND deelnemers.MaaltijdID = ?' [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    //To-do: list all participants
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

        var insertedStudentId = req.params.id;
        var insertedMaaltijdId = req.params.mId;

        db.query('SELECT * FROM deelnemers WHERE deelnemers.StudentenhuisID = ? AND deelnemers.MaaltijdID = ?' [insertedStudentId, insertedMaaltijdId], function(error, rows, fields) {
            if (error) {
                res.status(400).json(error);
            } else {
                if (rows.length == 0) {
                    const error = new api_error('Niet gevonden (huisId of maaltijdId bestaat niet)', 404);
                    res.status(404).json(error);
                } else {
                    //To-do: if one of the UserIDs = userToken: delete from table
                }
            }
        });
    }
}