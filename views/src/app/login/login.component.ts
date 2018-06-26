import { Component, OnInit } from '@angular/core';
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
  loginUserName;
  loginPassword;
  userName;
  password;
  confirmPassword;
  firstName;
  lastName;
  email;
  gender;
  birthDay;
  check = true;
  year;
  month;
  day;
  hide = false;
  rememME = false;
  emailToReset;
  MyKey;
  showPage = false;
  isBlogger=false;

  // navHeader: NavHeader[] = [];
  constructor(private router: Router, private appService: AppService, private authGuard: AuthGuard) { }

  ngOnInit() {
     localStorage.removeItem('DoshUserName');
     localStorage.removeItem('DoshPassword');
    if (localStorage.getItem('DoshUserName') && localStorage.getItem('DoshPassword')) {
      this.loginUserName = localStorage.getItem('DoshUserName');
      this.loginPassword = localStorage.getItem('DoshPassword');
      if(!this.login(false))
      {
        alert("remove local storage");
        localStorage.removeItem('DoshUserName');
        localStorage.removeItem('DoshPassword');
      }
    }
    else
      this.showPage = true;
  }

  login(AfterSignup) {
    if (AfterSignup) {
      alert("This is login after signup");
      this.loginUserName = this.userName;
      this.loginPassword = this.password;
    }
    this.appService.getKey(new User(this.loginUserName, ""))
      .subscribe(resKey => {
        if (resKey.key) {
          var encryptedPassword = crypto.AES.encrypt(md5(this.loginPassword), resKey.key).toString();
          this.appService.login(new User(this.loginUserName, encryptedPassword))
            .subscribe(res => {
              if (res.status == "OK") {
                if (this.rememME)
                  this.rememberMe();
                this.router.navigate(['/']);
              }
              else
                alert("Error message: " + res.message);
                return false;
            })
        }
        else
          alert("Have a problem with the key.");
      });
  }

  signup() {
    if (this.password == this.confirmPassword) {
      this.appService.getKey(new User(this.userName, ""))
        .subscribe(resKey => {
          var encryptedPassword = crypto.AES.encrypt(md5(this.password), resKey.key).toString();
          this.birthDay = this.year + "-" + this.month + "-" + this.day;
          this.appService.signup(new User(this.userName, encryptedPassword,
            this.firstName, this.lastName, this.email, this.gender, this.birthDay,this.isBlogger))
            .subscribe(res => {
              alert(res.message);
              if (res.status == "OK")
                this.login(true);
            })
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
      this.gender = "Female";
    else
      this.gender = "Male";
  }
  switch() { this.hide = !this.hide; }
  switchRememberMe() { this.rememME = !this.rememME; }
  switchBlogger() { this.isBlogger = !this.isBlogger; }


  rememberMe() {
    localStorage.setItem('DoshUserName', this.loginUserName);
    localStorage.setItem('DoshPassword', this.loginPassword);
  }
  resetPassword() {
    this.appService.askToResetPassword(this.emailToReset)
      .subscribe(res => {
        if (res.status)
          alert(res.message);
        else
          alert("Somthing went wrong..");
      })
  }
}