const validator = require("email-validator");
const api_error = require('../models/apierror');
const assert = require('assert');
const User = require('../models/user');

module.exports = {
    createUser(req, res, next){
        try {
            assert.equal(typeof(req.body.firstname), 'string', 'Expected a string!')
            assert.ok(req.body.firstname.length > 2, 'Value must be longer than 2 chars!')
            assert.equal(typeof(req.body.lastname), 'string', 'Expected a string!')
            assert.ok(req.body.lastname.length > 2, 'Value must be longer than 2 chars!')
            assert.equal(typeof(req.body.email), 'string', 'Expected a string!')
            assert.equal(typeof(req.body.password), 'string', 'Expected a string!')
        }
        catch (ex) {
            console.log("Exception: "+ ex.toString());
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
            res.status(412).json(error);
        }
        
        if (!validator.validate(req.body.email)){
            console.log("Email validatie mislukt tijdens registratie!");
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
            res.status(412).json(error);
        }

        return new User(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
    }
}