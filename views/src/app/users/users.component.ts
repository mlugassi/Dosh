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
  currentUser: String;
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
  }

  deleteUser(userName: String) {
  }

  editPassword() {
    if ($("#checkbox-pass-editUser").prop('checked')) {
      $("#lopass-editUser").show();
      $("#opass-editUser").show();
      $("#lpass-editUser").show();
      $("#pass-editUser").show();
      $("#lvpass-editUser").show();
      $("#vpass-editUser").show();
      $("#opass-editUser").prop('required', true);
      $("#pass-editUser").prop('required', true);
      $("#vpass-editUser").prop('required', true);
    } else {
      $("#lopass-editUser").hide();
      $("#opass-editUser").hide();
      $("#lpass-editUser").hide();
      $("#pass-editUser").hide();
      $("#lvpass-editUser").hide();
      $("#vpass-editUser").hide();
      $("#opass-editUser").prop('required', false);
      $("#pass-editUser").prop('required', false);
      $("#vpass-editUser").prop('required', false);
    }
  }
  updateUser() {

  }
}
