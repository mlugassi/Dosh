export default class User {
  username: string;
  password: string;
  firstName: String;
  lastName: String;
  email: String;
	gender: String;
	role: String;
  active: Boolean;
  admin: Boolean;

  constructor(user,psw,fn="",ln="",email="",gen="",role="",active=true,admin=false) {
    this.username = user;
    this.password = psw;
    this.firstName=fn;
    this.lastName=ln;
    this.email=email;
    this.gender=gen;
    this.role=role;
    this.active=active;
    this.admin=admin;
  }
}
