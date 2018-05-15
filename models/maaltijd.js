class Maaltijd {

    constructor(maaltijdID, name, desc, ingredients, allergies, price, userID, studentenhuisID){
        this.maaltijdID = maaltijdID;
        this.name = name;
        this.desc = desc;
        this.ingredients = ingredients;
        this.allergies = allergies;
        this.price = price;
        this.userID = userID;
        this.studentenhuisID = studentenhuisID;
    }

    getMaaltijdID(){
        return this.maaltijdID;
    }

    getName(){
        return this.name;
    }

    getDesc(){
        return this.desc;
    }

    getIngredients(){
        return this.ingredients;
    }

    getAllergies(){
        return this.allergies;
    }

    getPrice(){
        return this.price;
    }

    getUserID(){
        return this.userID;
    }

    getStudentenHuisID(){
        return this.studentenhuisID;
    }
}

module.exports = Maaltijd;