const db = require('../config/db');

class Studentenhuis {

    constructor(studentenhuisID, name, address, contact, email){
        this.ID = studentenhuisID;
        this.naam = name;
        this.adres = address;
        this.contact = contact;
        this.email = email;
    }

    getStudentenhuisID(){
        return this.studentenhuisID;
    }

    getName(){
        return this.name;
    }

    getAddress(){
        return this.address;
    }

    getContact(){
        return this.userID;
    }

    getEmail(){
        return this.email;
    }
}

module.exports = Studentenhuis;