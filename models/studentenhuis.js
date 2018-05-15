class Studentenhuis {

    constructor(studentenhuisID, name, address, userID){
        this.studentenhuisID = studentenhuisID;
        this.name = name;
        this.address = address;
        this.userID = userID;
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

    getUserID(){
        return this.userID;
    }
}

module.exports = Studentenhuis;