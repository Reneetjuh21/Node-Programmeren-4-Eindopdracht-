class Deelnemer {

    constructor(userID, studentenhuisID, maaltijdID){
        this.userID = userID;
        this.studentenhuisID = studentenhuisID;
        this.maaltijdID = maaltijdID;
    }

    getUserID(){
        return this.userID;
    }

    getStudentenHuis(){
        return this.studentenhuisID;
    }

    getMaaltijdID(){
        return this.maaltijdID;
    }
}

module.exports = Deelnemer;