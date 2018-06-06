import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../services/app.service';
import User from '../models/User';
import NavHeader from '../models/navHeader';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items1 = [
    { link: "index.html", name: 'Home' },
    { link: "about.html", name: 'About' },
    { link: "contact.html", name: 'Contact' },
  ];
  items2 = [
    { link: "#", name: ' Sign Up', class: "glyphicon glyphicon-user", modal: '#signup-modal',click:"logout()"},
    { link: "#", name: ' Login', class: "glyphicon glyphicon-log-in", modal: '#login-modal',click:"logout()" },
  ];
  userName = "";
  password = "";
  @Input() nav: { link: string, name: string };

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.appService.navbar()
      .subscribe(res => {
        //this.todosList.push(res.data)
        //assign the todolist property to the proper http response
        this.items1=res[0];
        this.userName="Hello " + res[1][0].name;
        this.items2 = [
          { link: "#", name:  ' Edit',    class: "glyphicon glyphicon-cog",     modal: '#edit-modal',  click:"logout()"},
          { link: "#", name:  ' Logout',  class: "glyphicon glyphicon-log-out", modal: '', click:"logout()"},
        ];
        /*.forEach(element => {

        res.forEach(element => {
          this.items1.push({
            name: element.name,
            link: element.link
          })
        });*/
      })
  }

  onAddItem(data: { navheader: NavHeader[] }) {
    this.items1=data.navheader;/*.forEach(element => {
      this.items1.push({
        name: element.name,
        link: element.link
      })
    });*/
    this.items2 = [
      { link: "#", name: ' Edit', class: "glyphicon glyphicon-cog", modal: '#signup-modal', click:"logout()" },
      { link: "#", name: ' Logout', class: "glyphicon glyphicon-log-out", modal: '#login-modal' ,click:"logout()"},
    ];
  }

  logout(){
    alert("logout ");
    // this.appService.navbar()
    // .subscribe(res => {
    //   this.items1=res[0];
    //   this.userName="Hello " + res[1].name;
    //   this.items2 = [
    //     { link: "#", name: ' Edit', class: "glyphicon glyphicon-cog", modal: '#edit-modal' , click:"logout()"},
    //     { link: "#", name: ' Logout', class: "glyphicon glyphicon-log-out", modal: '', click:"logout()"},
    //   ];
    // })
  }

}
