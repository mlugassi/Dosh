export class AuthService {
    private loggedIn = false;

    isAuth() {
        return this.loggedIn;
    }
    logout(){
        this.loggedIn = false;

    }
    login(){
        this.loggedIn = true;
        alert(this.loggedIn);
    }
}