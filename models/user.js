class User {

    constructor(firstname, lastname, email, password){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

    getfirstname(){
        return this.firstname;
    }

    getlastname(){
        return this.lastname;
    }

    getemail(){
        return this.email;
    }

    getpassword(){
        return this.password;
    }
}

module.exports = User;