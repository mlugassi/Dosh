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
  currentUser: String;
  private appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  ngOnInit() {
    $("#modal").hide();
    this.appService.get_users()
      .subscribe(res => {
        this.users = [];
        res.forEach(element => {
          this.users.push(element);
        });
      })
  }

  openModal(userName: String) {
    this.currentUser = userName;
    this.appService.get_user(userName)
      .subscribe(res => {
        if (res == undefined || res == null)
          return;
        $("#fname").val(res.firstName);
        $("#lname").val(res.lastName);
        $("#uname").val(res.userName);
        $("#email").val(res.email);
        $("#gender").val(res.gender);
        this.isAdmin = res.isAdmin;
        this.isBlogger = res.isBlogger;
        this.editPass = true;
        this.editPassword();
        $("#modal").show();
      })
  }

  deleteUser(userName: String) {
  }

  editPassword() {
    this.editPass = !this.editPass;
    alert(this.editPass);
    if (this.editPass) {
      $("#lpass").show();
      $("#pass").show();
      $("#lvpass").show();
      $("#vpass").show();
      $("#pass").prop('required', true);
      $("#vpass").prop('required', true);
    } else {
      $("#lpass").hide();
      $("#pass").hide();
      $("#lvpass").hide();
      $("#vpass").hide();
      $("#pass").prop('required', false);
      $("#vpass").prop('required', false);
    }
  }
  updateUser() {
    // $("status-" + userName).val("Pendding");
    // var status = !$("#status-cb").is(':checked');
    // $.post("users/update",
    //   {
    //     uname: userName,
    //     firstName: $("#fname").val(),
    //     lastName: $("#lname").val(),
    //     userName: $("#uname").val(),
    //     branch: $("#branch").val(),
    //     role: $("#role").val(),
    //     gender: $("#gender").val(),
    //     active: status
    //   },
    //   function (data, status) {
    //     document.getElementById("status-" + userName).innerHTML = "Pedding";
    //     var json = jQuery.parseJSON(data);
    //     if (json.status = "OK")
    //       document.getElementById("status-" + userName).innerHTML = "Updated";
    //     else
    //       document.getElementById("status-" + userName).innerHTML = "Error";
    //   });

    // if ($("#status-cb").is(':checked')) {
    //   deleteUser(userName);
    // }
    // else {
    //   document.getElementById("img-" + userName).innerHTML = "img/" + $("#gender").val() + ".jpg";
    //   document.getElementById("name-" + userName).innerHTML = $("#fname").val() + " " + $("#lname").val();
    //   document.getElementById("role-" + userName).innerHTML = $("#role").val();
    //   if ($("#role").val() == "employee" && $("#branch").val() != "")
    //     document.getElementById("branch-" + userName).innerHTML = $("#branch").val().substring(0, $("#branch").val().indexOf(' '));

    // }
  }

  changeAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  changeBlogger() {
    this.isBlogger = !this.isBlogger;
  }
}
