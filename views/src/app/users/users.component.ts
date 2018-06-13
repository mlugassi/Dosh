import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../services/app.service';
import * as $ from 'jquery';
import User from '../models/User'
declare var $: any;

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
  modal;

  constructor(private appService: AppService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.appService.get_users()
      .subscribe(res => {
        this.users = res;
      })
  }

  openModal(userName: String, myModal) {
    this.appService.get_user(userName)
      .subscribe(res => {
        if (res == undefined || res == null)
          return;

        this.modal=this.modalService.open(myModal);
        $("#fname").val(res.firstName);
        $("#lname").val(res.lastName);
        $("#uname").val(res.userName);
        $("#email").val(res.email);
        $("#gender").val(res.gender);
        $("#img").attr("src", res.imgPath);
        $("#day").val(res.birthDay.substr(8, 2));
        $("#month").val(res.birthDay.substr(5, 2));
        $("#year").val(res.birthDay.substr(0, 4));
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
      $("#pass").val("");
      $("#vpass").val("");
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
    user.birthDay = $("#year").val() + "-" + $("#month").val() + "-" + $("#day").val();
    user.isAdmin = this.isAdmin;
    user.isBlogger = this.isBlogger;
    this.uploadImage();
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
        this.modal.close();
      });
  }

  changeAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  changeBlogger() {
    this.isBlogger = !this.isBlogger;
  }

  uploadImage() {
    let file = $('#uploadedImg').prop('files')[0];
    if (file == undefined || file == null) return;
    let formData = new FormData();
    formData.append('uploadedImg', file, $("#uname").val() + ".jpg");
    this.appService.upload_Image(formData).subscribe(res => {
      if (JSON.parse(res).status != "OK") {
        alert(res);
        return;
      }
    });
  }

}
