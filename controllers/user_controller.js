const validator = require("email-validator");
const api_error = require('../models/apierror');
const assert = require('assert');
const User = require('../models/user');

module.exports = {
    createUser(req, res, next){
        if (req.body.firstname != null &&  req.body.lastname != null && req.body.email != null && req.body.password != null){
            try {
                assert.equal(typeof(req.body.firstname), 'string', 'Expected a string!')
                assert.ok(req.body.firstname.length > 1, 'Value must be longer than 1 chars!')
                assert.equal(typeof(req.body.lastname), 'string', 'Expected a string!')
                assert.ok(req.body.lastname.length > 1, 'Value must be longer than 1 chars!')
                assert.equal(typeof(req.body.email), 'string', 'Expected a string!')
                assert.equal(typeof(req.body.password), 'string', 'Expected a string!')
            }
            catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                res.status(412).json(error);
            }
            
            if (!validator.validate(req.body.email)){
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
                res.status(412).json(error);
            }
        } else {
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 412);
            res.status(412).json(error);
        }

        return new User(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
    }
}