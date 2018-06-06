import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import User from '../models/User';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  userName = "";
  password = "";
  confirmPassword = "";
  firstName = "";
  lastName = "";
  email = "";
  gender = "";
  role = "Manager";
  active = "";
  admin = "";
  check = true;
  hide=false;

  // navHeader: NavHeader[] = [];
  constructor(private appService: AppService) { }
  
  ngOnInit() {
  }
  login() {
    this.appService.login(new User(this.userName, this.password))
      .subscribe(res => {
        if (res.status == "OK") {
          window.location.reload();
          this.login();
        }
        else
          alert(res.message);
        // this.addItem.emit({
        //   navheader: res,
        // });
      })
  }

  signup() {
    if (this.password == this.confirmPassword) {
      this.appService.signup(new User(this.userName, this.password,
        this.firstName, this.lastName, this.email, this.gender, this.role))
        .subscribe(res => {
          alert(res.message);
          if (res.status == "OK")
            this.login();
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
  switch()
  {
    this.hide=!this.hide;
  }
}
