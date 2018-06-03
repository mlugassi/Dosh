import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { AppService } from '../../services/app.service';
import User from '../../models/User';
import NavHeader from '../../models/navHeader';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName= "";
  location = ""
  password = "";
  navHeader: NavHeader[] = [];
  constructor(private appService: AppService) { }

  ngOnInit() {
  }
  login() {
    alert("in login");
    this.appService.post_login(new User(this.userName,this.password))
      .subscribe(res => {
        //this.todosList.push(res.data)
        //assign the todolist property to the proper http response
        this.navHeader = res;
        alert(this.navHeader[0].link);
        alert(this.navHeader[0].name);
        console.log(res);
      })
    }

}
