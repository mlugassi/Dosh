import Inbox from "./Inbox";

export default class User {
  firstName: String;
  lastName: String;
  userName: String;
  password: String;
  email: String;
  gender: String;
  imgPath: String|any;
  blogs: Number;
  inbox: Inbox[];
  isAdmin: Boolean;
  isBlogger: Boolean;
  isActive: Boolean;
  birthDay: String;
  newInbox: Boolean;

  constructor(userName, password, firstName = "", lastName = "", email = "",
    gender = "", birthDay = "", isBlogger = false, isAdmin = false, blogs = 0, inbox = [],
    imgPath = "/images/users_profiles/" + gender + "default.jpg", isActive = true) {
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
