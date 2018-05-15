class Maaltijd {

    constructor(maaltijdID, name, desc, ingredients, allergies, price){
        this.ID = maaltijdID;
        this.naam = name;
        this.beschrijving = desc;
        this.ingredienten = ingredients;
        this.allergie = allergies;
        this.prijs = price;
    }

    getMaaltijdID(){
        return this.ID;
    }

    getName(){
        return this.naam;
    }

    getDesc(){
        return this.beschrijving;
    }

    getIngredients(){
        return this.ingredienten;
    }

    getAllergies(){
        return this.allergie;
    }

    getPrice(){
        return this.prijs;
    }
}

module.exports = Maaltijd;