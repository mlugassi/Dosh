import { Component, OnInit } from '@angular/core';
import User from '../models/User';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User;// = new User("a", "a", "a", "a", "a@walla.com", "Male", "a", true, true, 0, [], "/images/banner1.jpg");
  editPass: Boolean = true;
  years = [];
  days = [];
  oldPassword;
  password;
  confirmPassword;
  yearBirthday;
  monthBirthday;
  dayBirthday;
  constructor(private appService: AppService) { }

  ngOnInit() {
    for (let index = 1900; index < 2019; index++)
      this.years.push(index);
    for (let index = 1; index < 32; index++)
      this.days.push(index);
      this.appService.get_user()
      .subscribe(res => {
        this.user = res;
        this.dayBirthday = this.user.birthDay.substring(8, 10);
        this.monthBirthday = this.user.birthDay.substring(5, 7);
        this.yearBirthday = this.user.birthDay.substring(0, 4);
      })
  }

  logout() {
    localStorage.removeItem('DoshUserName');
    localStorage.removeItem('DoshPassword');
  }
  update() {
    //alert("update");
  }
  editPassword() {
    this.editPass = !this.editPass;

  }
}
