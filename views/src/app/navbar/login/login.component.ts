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

  userName= "Refael";
  location = "dfsgvxcv"
  password = "1234567890";
  navHeader: NavHeader[] = [];
  constructor(private appService: AppService) { }

  ngOnInit() {
  }
  login() {
    console.log("In login");
    alert("in login");
    // this.appService.post_login(new User(this.userName,this.password))
    //   .subscribe(res => {
    //     //this.todosList.push(res.data)
    //     //assign the todolist property to the proper http response
    //     this.navHeader = res;
    //     console.log(res);
    //   })
    }

}
