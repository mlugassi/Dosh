import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import User from '../models/User';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  loginUserName;
  loginPassword;
  userName;
  password;
  confirmPassword;
  firstName;
  lastName;
  email;
  gender;
  bitrhday;
  check = true;
  year;
  month;
  day;
  hide = false;
  rememME = false;
  // navHeader: NavHeader[] = [];
  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
    // if (sessionStorage.getItem('DoshUserName')) {
    //   this.loginUserName = sessionStorage.getItem('DoshUserName');
    //   if (sessionStorage.getItem('DoshPassword'))
    //     this.loginPassword = sessionStorage.getItem('DoshPassword');
    // }
  }

  login(AfterSignup) {
    if(AfterSignup)
    {
      alert("This is login after signup");
      this.loginUserName=this.userName;
      this.loginPassword=this.password;
    }
    alert(this.loginUserName+"\t" + this.loginPassword);
    this.appService.login(new User(this.loginUserName, this.loginPassword))
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.status);
          if (this.rememME)
            this.rememberMe();
          this.router.navigate(['/navbar']);
        }
        else
          alert("Error message: " + res.message);
      })
  }

  signup() {
    if (this.password == this.confirmPassword) {
      this.bitrhday = this.year + "-" + this.month + "-" + this.day;
      this.appService.signup(new User(this.userName, this.password,
        this.firstName, this.lastName, this.email, this.gender, this.bitrhday))
        .subscribe(res => {
          alert(res.message);
          if (res.status == "OK")
            this.login(true);
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
  switch() {
    this.hide = !this.hide;
  }
  rememberMe() {
    sessionStorage.setItem('DoshuserName', this.loginUserName);
    sessionStorage.setItem('Doshpassword', this.loginPassword);
  }
}
