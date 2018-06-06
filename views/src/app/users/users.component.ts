import { Component, OnInit } from '@angular/core';
import User from '../models/User'
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];
  private appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  ngOnInit() {
    this.appService.get_users()
      .subscribe(res => {
        this.users = [];
        res.forEach(element => {
          alert(element.firstName);
          this.users.push(element);
        });
      })
  }

}
