const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

// before(function(){
//     validToken = require('./authentication.routes.test').token
//     console.log('TOKEN ' + validToken)
// })

before(function(){
    global.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjY1NzQ3MTYsImlhdCI6MTUyNjQwMTkxNiwibWFpbCI6ImpzbWl0QHNlcnZlci5ubCIsInVzZXJJRCI6MX0.TrSDN7PY6IZeMJSZnUpkH3LfSvHeKUqW0FRCjZkqAeM';
});

describe('Studentenhuis API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        chai.request(server)
            .post('/api/studentenhuis')
            .set('Authorization', 'Bearer '+token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let studentenhuis = {
            naam: 'Herstraat',
            adres: 'Herstraat 9 Den Hout'
        };

        chai.request(server)
            .post('/api/studentenhuis')
            .set('Authorization', 'Bearer '+global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('ID');
                res.body.should.have.property('Naam');
                res.body.should.have.property('Adres');
                res.body.should.have.property('UserID');
            });

        done()
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let studentenhuis = {
            adres: 'Herstraat 9 Den Hout'
        };

        chai.request(server)
            .post('/api/studentenhuis')
            .set('Authorization', 'Bearer '+global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(412);
            });

        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let studentenhuis = {
            naam: 'Herstraat'
        };

        chai.request(server)
            .post('/api/studentenhuis')
            .set('Authorization', 'Bearer '+global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(412);
            });

        done();
    })
})

describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        chai.request(server)
            .get('/api/studentenhuis')
            .set('Authorization', 'Bearer '+token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()
    })

    it('should return all studentenhuizen when using a valid token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
            .get('/api/studentenhuis')
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) => {
                res.body.should.be.a('array');
            });

        done()
    })
})

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('Authorization', 'Bearer '+token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
            });

        done()
    })

    it('should return an error when using an non-existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
            .get('/api/studentenhuis/999')
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) => {
                res.should.have.status(404);
            });

        done()
    })
})

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('Authorization', 'Bearer '+token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()
    })

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let studentenhuis = {
            naam: 'Herstraat',
            adres: 'Herstraat 9 Den Hout'
        };

        chai.request(server)
            .put('/api/studentenhuis/75')
            .send(studentenhuis)
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) =>{
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('ID');
            });


        done()
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let studentenhuis = {
            adres: 'Herstraat 9 Den Hout'
        };

        chai.request(server)
            .put('/api/studentenhuis/7')
            .send(studentenhuis)
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) => {
                res.should.have.status(412)
            });


        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let studentenhuis = {
            naam: 'Herstraat'
        };

        chai.request(server)
            .put('/api/studentenhuis/7')
            .send(studentenhuis)
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) => {
                res.should.have.status(412)
            });

        done()
    })
})

describe('Studentenhuis API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        chai.request(server)
            .delete('/api/studentenhuis/8')
            .set('Authorization', 'Bearer '+token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        chai.request(server)
            .delete('/api/studentenhuis/8')
            .set('Authorization', 'Bearer '+global.token)
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
            });

        done()
    // })

    // it('should throw an error when naam is missing', (done) => {
    //     //
    //     // Hier schrijf je jouw testcase.
    //     //
    //     done()
    // })

    // it('should throw an error when adres is missing', (done) => {
    //     //
    //     // Hier schrijf je jouw testcase.
    //     //
    //     done()
    // })
    })
});