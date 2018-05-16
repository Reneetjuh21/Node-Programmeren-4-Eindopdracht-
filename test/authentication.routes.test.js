/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should()
chai.use(chaiHttp)

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken

describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        // expect(auth.encodeToken("test@testmail.nl", 99)).to.not.throw();
        // var token = auth.encodeToken("test@testmail.nl", 99);
        // expect(token).to.not.be.null;
        // expect(token).to.not.be.undefined;

        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "testman",
                "lastname": "tesla",
                "email": "manwithtestmail@testmail.com",
                "password": "supersafepassword"
            })
            .end((err,res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const response = res.body
                response.should.have.property('token').which.is.an('object')
            })

        // Tip: deze test levert een token op. Dat token gebruik je in 
        // andere testcases voor beveiligde routes door het hier te exporteren
        // en in andere testcases te importeren via require.
        // validToken = res.body.token
        // module.exports = {
        //     token: validToken
        // }
        done()
    })

    it('should return an error on GET request', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/register')
            .end((err,res) => {
                res.should.have.status(400)
            })
        done()
    })

    it('should throw an error when the user already exists', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "Jan",
            "lastname": "Smit",
            "email": "jsmit@server.nl",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(401)
        })

        done()
    })

    it('should throw an error when no firstname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/register')
        .send({
            "lastname": "Smit",
            "email": "supertest@hotmail.com",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(412)
        })

        done()
    })

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "J",
            "lastname": "Smit",
            "email": "legoduplo@lego.com",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(412)
        })

        done()
    })

    it('should throw an error when no lastname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "Jan",
            "email": "Jansprivemail@jantje.nl",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(412)
        })

        done()
    })

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "Jan",
            "lastname": "S",
            "email": "testjan@jan.nl",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(412)
        })

        done()
    })

    it('should throw an error when email is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "Jan",
            "lastname": "Smit",
            "email": "jsmit",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(412)
        })

        done()
    })

})

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
            .post('/api/login')
            .send({
                "email": "jsmit@server.nl",
                "password": "secret"
            })
            .end((err,res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const response = res.body
                response.should.have.property('token').which.is.an('object')

                validToken = res.body.token
                module.exports = {
                    token: validToken
                }
            })
        done()
    })

    it('should throw an error when email does not exist', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/login')
        .send({
            "email": "",
            "password": "secret"
        })
        .end((err,res) => {
            res.should.have.status(401)
        })
        done()
    })

    it('should throw an error when email exists but password is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
        .post('/api/login')
        .send({
            "email": "jsmit@server.nl",
            "password": "invalidpassword"
        })
        .end((err,res) => {
            res.should.have.status(401)
        })
        done()
    })

    it('should throw an error when using an invalid email', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
        .post('/api/login')
        .send({
            "email": "invalidemail@tryagain.com",
            "password": "invalidpassword"
        })
        .end((err,res) => {
            res.should.have.status(401)
        })
        done()
    })

})