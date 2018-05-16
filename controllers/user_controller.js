const validator = require("email-validator");
const api_error = require('../models/apierror');
const assert = require('assert');
const User = require('../models/user');

module.exports = {
    createUser(req, res, next){
        if (typeof req.body.firstname === "undefined" ||  typeof req.body.lastname === "undefined" || typeof req.body.email === "undefined" || typeof req.body.password === "undefined"){
            const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 401);
            next(error);
            return
        } else {
            try {
                assert.equal(typeof(req.body.firstname), 'string', 'Expected a string!')
                assert.ok(req.body.firstname.length > 1, 'Value must be longer than 1 chars!')
                assert.equal(typeof(req.body.lastname), 'string', 'Expected a string!')
                assert.ok(req.body.lastname.length > 1, 'Value must be longer than 1 chars!')
                assert.equal(typeof(req.body.email), 'string', 'Expected a string!')
                assert.equal(typeof(req.body.password), 'string', 'Expected a string!')

                if (!validator.validate(req.body.email)){
                    const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 401);
                    next(error);
                    return
                } else {
                    return new User(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
                }
            }
            catch (ex) {
                const error = new api_error("Een of meer properties in de request body ontbreken of zijn foutief", 401);
                next(error);
                return
            }
        }
    }
}