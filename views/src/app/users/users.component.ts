import { Component, OnInit } from '@angular/core';
import User from '../models/User'
import { AppService } from '../services/app.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];
  editPass: Boolean;
  isBlogger: Boolean;
  isAdmin: Boolean;
  private appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  ngOnInit() {
    this.appService.get_users()
      .subscribe(res => {
        this.users = [];
        res.forEach(element => {
          this.users.push(element);
        });
      })
  }

  openModal(userName: String) {
    this.appService.get_user(userName)
      .subscribe(res => {
        if (res == undefined || res == null)
          return;
        $("#fname").val(res.firstName);
        $("#lname").val(res.lastName);
        $("#uname").val(res.userName);
        $("#email").val(res.email);
        $("#gender").val(res.gender);
        $("#img").attr("src","../../assets/images/" + res.imgPath);

        this.isAdmin = res.isAdmin;
        this.isBlogger = res.isBlogger;
        this.editPass = true;
        this.editPassword();
      });
  }

  deleteUser(userName: String) {
    this.appService.delete_user(userName)
      .subscribe(res => {
        if (JSON.parse(res).status != "OK") {
          alert(res);
          return;
        }
        let tempUsers: User[];
        this.users.forEach(user => {
          if (user.userName != userName)
            tempUsers.push(user);
        });
        this.users = tempUsers;
      });
  }

  editPassword() {
    this.editPass = !this.editPass;
    if (this.editPass) {
      $("#pass").show();
      $("#vpass").show();
      $("#pass").prop('required', true);
      $("#vpass").prop('required', true);
    } else {
      $("#pass").hide();
      $("#vpass").hide();
      $("#pass").prop('required', false);
      $("#vpass").prop('required', false);
    }
  }
  updateUser() {
    let user = new User($("#uname").val(), "");
    user.firstName = $("#fname").val();
    user.lastName = $("#lname").val();
    user.email = $("#email").val();
    user.gender = $("#gender").val();
    user.isAdmin = this.isAdmin;
    user.isBlogger = this.isBlogger;
    if (this.editPass && $("#pass").val() == $("#vpass").val())
      user.password = $("#pass").val();
    else if (this.editPass) {
      alert("Password and Confirm Paswword don't match!");
      return;
    }

    this.appService.update_user(user)
      .subscribe(res => {
        if (JSON.parse(res).status != "OK") {
          alert(res);
          return;
        }
      });
  }

  changeAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  changeBlogger() {
    this.isBlogger = !this.isBlogger;
  }
}
