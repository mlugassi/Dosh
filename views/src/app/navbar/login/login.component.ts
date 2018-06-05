import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../services/app.service';
import User from '../../models/User';
import NavHeader from '../../models/navHeader';
import { $ } from 'protractor';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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


  @ViewChild('login-modal') login_modal: ElementRef;
  // navHeader: NavHeader[] = [];
  constructor(private appService: AppService) { }
  @Output() addItem = new EventEmitter<{ navheader: NavHeader[] }>();

  ngOnInit() {
  }
  login() {
    this.appService.login(new User(this.userName, this.password))
      .subscribe(res => {
        this.addItem.emit({
          navheader: res,
        });
      })
  }

  signup() {
    if (this.password == this.confirmPassword) {
      this.appService.signup(new User(this.userName, this.password,
        this.firstName, this.lastName, this.email, this.gender, this.role))
        .subscribe(res => {
          this.login();
          // this.addItem.emit({
          //   navheader: res,
          // });
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

}
