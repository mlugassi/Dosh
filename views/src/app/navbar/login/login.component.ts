import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
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

  userName= "";
  password = "";
  @ViewChild('login-modal')  login_modal: ElementRef ;
  // navHeader: NavHeader[] = [];
  constructor(private appService: AppService) { }
  @Output() addItem = new EventEmitter<{navheader: NavHeader[]}>();

  ngOnInit() {
  }
  login() {
    this.appService.post_login(new User(this.userName,this.password))
      .subscribe(res => {
        //this.todosList.push(res.data)
        //assign the todolist property to the proper http response

          this.addItem.emit({
            navheader: res,
          });
          //$(this.login_modal.nativeElement).modal('hide');

        // this.navHeader = res;
        // alert(this.navHeader[0].link);
        // alert(this.navHeader[0].name);
        // console.log(res);
      })
    }

}
