import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';

import User from '../models/User';
import * as crypto from '../../../../node_modules/crypto-js';
import * as md5 from '../../../../node_modules/md5';
import { AuthGuard } from '../auth.guard';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User("", "");
  loginUserName;
  loginPassword;
  password;
  confirmPassword;
  check = true;
  year;
  month;
  day;
  hide = false;
  rememME = false;
  emailToReset;
  MyKey;
  showPage = false;
  //isBlogger = false;
  // navHeader: NavHeader[] = [];
  constructor(private router: Router, private appService: AppService, private authGuard: AuthGuard) { }

  ngOnInit() {
    if (localStorage.getItem('DoshUserName') && localStorage.getItem('DoshPassword')) {
      this.loginUserName = localStorage.getItem('DoshUserName');
      this.loginPassword = localStorage.getItem('DoshPassword');
      this.login(false);
    }
    else
      this.showPage = true;
  }

  login(AfterSignup) {
    alert("in login");
    if (AfterSignup) {
      alert("This is login after signup");
      this.loginUserName = this.user.userName;
      this.loginPassword = this.password;
    }
    this.appService.getKey(new User(this.loginUserName, ""))
      .subscribe(resKey => {
        if (resKey.status && resKey.key) {
          var encryptedPassword = crypto.AES.encrypt(md5(this.loginPassword), resKey.key).toString();
          this.appService.login(this.loginUserName, encryptedPassword)
            .subscribe(res => {
              if (res.status) {
                if (this.rememME)
                  this.rememberMe();
                this.router.navigate(['/']);
              }
              else {
                alert("Error message: " + res.message);
                localStorage.removeItem('DoshUserName');
                localStorage.removeItem('DoshPassword');
              }
            })
        }
        else
          alert("Have a problem with the key.");
      });
  }

  signup() {
    if (this.password == this.confirmPassword) {
      this.appService.getKey(new User(this.user.userName, ""))
        .subscribe(resKey => {
          if (resKey.status && resKey.key) {
            this.user.password = crypto.AES.encrypt(md5(this.password), resKey.key).toString();
            this.user.birthDay = this.year + "-" + this.month + "-" + this.day;
            this.appService.signup(this.user)
              .subscribe(res => {
                alert(res.message);
                if (res.status)
                  this.login(true);
              })
          }
        })
    }
    else {
      alert("The passwords are differents");
      this.password = "";
      this.confirmPassword = "";
    }
  }

  onSelectionChange() {
    this.check = !this.check;
    if (!this.check)
      this.user.gender = "Female";
    else
      this.user.gender = "Male";
  }
  switch() { this.hide = !this.hide; }
  switchRememberMe() { this.rememME = !this.rememME; }
  switchBlogger() { this.user.isBlogger = !this.user.isBlogger; }


  rememberMe() {
    localStorage.setItem('DoshUserName', this.loginUserName);
    localStorage.setItem('DoshPassword', this.loginPassword);
  }
  resetPassword() {
    this.appService.askToResetPassword(this.emailToReset)
      .subscribe(res => {
        if (res.message)
          alert(res.message);
        else
          alert("Somthing went wrong..");
      })
  }
  google() {
    this.appService.google()
      .subscribe(res => {
        if (res)
          alert(res);
        else
          alert("Somthing went wrong..");
      })
  }
}