import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items1 = [
    { link: "index.html", name: 'Home' },
    { link: "about.html", name: 'About' },
    { link: "contact.html", name: 'Contact' },
  ];
  items2 = [
    { link: "#", name: ' Sign Up', class: "glyphicon glyphicon-user", modal: '#signup-modal' },
    { link: "#", name: ' Login', class: "glyphicon glyphicon-log-in", modal: '#login-modal' },
    //{ link: "#", name:  ' Logout',  class: "glyphicon glyphicon-log-out", toggle:"collapse",modal: ''},
  ];
  logoutShow=false;
  userName = "";
  password = "";
 // @Input() nav: { link: string, name: string };

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.appService.navbar()
      .subscribe(res => {
        //this.todosList.push(res.data)
        //assign the todolist property to the proper http response
        //this.items1=res[0];
        //this.userName="Hello " + res[1][0].name;
        //this.logoutShow=true;
        //this.items2 = [
         // { link: "#", name:  ' Edit',    class: "glyphicon glyphicon-cog", modal: '#edit-modal'},
         // { link: "/login/logout", name:' Logout',  class: "glyphicon glyphicon-log-out", modal: ''},
        //];
        /*.forEach(element => {

        res.forEach(element => {
          this.items1.push({
            name: element.name,
            link: element.link
          })
        });*/
      })
  }

  // onAddItem(data: { navheader: NavHeader[] }) {
  //   this.items1=data.navheader;/*.forEach(element => {
  //     this.items1.push({
  //       name: element.name,
  //       link: element.link
  //     })
  //   });*/
  //   this.items2 = [
  //     { link: "#", name: ' Edit', class: "glyphicon glyphicon-cog", modal: '#signup-modal', click:"logout()" },
  //     { link: "#", name: ' Logout', class: "glyphicon glyphicon-log-out", modal: '#login-modal' ,click:"logout()"},
  //   ];
  // }

  test(){
    alert("test ");

  }
  logout(){
    alert("logout ");
    localStorage.removeItem('DoshUserName');
    localStorage.removeItem('DoshPassword');
  }

}
