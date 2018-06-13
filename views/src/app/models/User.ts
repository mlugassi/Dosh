import Inbox from "./Inbox";

export default class User {
  firstName: String;
  lastName: String;
  userName: String;
  password: String;
  email: String;
  gender: String;
  imgPath: String;
  blogs: Number;
  inbox: Inbox[];
  isAdmin: Boolean;
  isBlogger: Boolean;
  isActive: Boolean;
  birthDay: String;

  constructor(userName, password, firstName = "", lastName = "",
    email = "", gender = "", birthDay = "", imgPath = "/images/users_profiles/" + gender + "default.jpg", blogs = 0, inbox = [],
    isBlogger = false, isActive = true, isAdmin = false) {
    this.userName = userName;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.gender = gender;
    this.birthDay = birthDay;
    this.isActive = isActive;
    this.isBlogger = isBlogger;
    this.isAdmin = isAdmin;
    this.imgPath = imgPath;
    this.blogs = blogs;
    this.inbox = inbox;

  }
}
