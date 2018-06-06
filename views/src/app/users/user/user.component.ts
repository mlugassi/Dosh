import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor() { }


  @Input() user: { username: string, password: string, firstName: String, lastName: String, email: String, gender: String, role: String, active: Boolean, admin: Boolean };

  ngOnInit() {
  }

}