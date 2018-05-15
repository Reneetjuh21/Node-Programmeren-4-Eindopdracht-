const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

before(function(){
    global.token = '';
});

describe('Studentenhuis API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'flk234fdlk4rlgsdf345dfg4245ersgfgsdfjsdfgiiuoghxx5';

        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-auth-token', token)
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
            .set('x-auth-token', global.token)
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
            .set('x-auth-token', global.token)
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
            .set('x-auth-token', global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(412);
            });

        done();

        done()
    })
})

describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        let token = 'flk234fdlk4rlgsdf345dfg4245ersgfgsdfjsdfgiiuoghxx5';

        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-auth-token', token)
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
            .set('x-auth-token', global.token)
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

        let token = 'flk234fdlk4rlgsdf345dfg4245ersgfgsdfjsdfgiiuoghxx5';

        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('x-auth-token', token)
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
            .set('x-auth-token', global.token)
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
            .set('x-auth-token', global.token)
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

        let token = 'flk234fdlk4rlgsdf345dfg4245ersgfgsdfjsdfgiiuoghxx5';

        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('x-auth-token', token)
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
            naam: 'Studentenhuis van Jan',
            adres: 'Den Dries 63 Gilze'
        };

        chai.request(server)
            .put('/api/studentenhuis/75')
            .send(studentenhuis)
            .set('x-auth-token', global.token)
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
            .set('x-auth-token', global.token)
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
            .set('x-auth-token', global.token)
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

        let token = 'flk234fdlk4rlgsdf345dfg4245ersgfgsdfjsdfgiiuoghxx5';

        chai.request(server)
            .delete('/api/studentenhuis/8')
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //


        done()
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})