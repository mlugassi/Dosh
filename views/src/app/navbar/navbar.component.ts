import { Component, OnInit } from '@angular/core';
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
    // { link: "shop.html", name: 'Catalog' },
    // { link: "sale.html", name: 'Manage users' },
    // { link: "about.html", name: 'Manage items' },
    // { link: "about.html", name: 'About' },
    // { link: "contact.html", name: 'Contact' },
  ];
  items2 = [
    { link: "#", name: ' Edit' , class:"glyphicon glyphicon-cog", modal:'#signup-modal'},
    { link: "#", name: ' Sign Up' , class:"glyphicon glyphicon-user", modal:'#signup-modal'},
    { link: "#", name: ' Login' , class:"glyphicon glyphicon-log-in" , modal:'#login-modal'},
    { link: "#", name: ' Logout' , class:"glyphicon glyphicon-log-out", modal:'#login-modal'},
  ];
  //user: User = new User();
  userName= "Refael";
  password = "";
  navHeader: NavHeader[] = [];

  constructor(private appService: AppService) { 
  }

  ngOnInit() {

  }
  onAddItem(data:{name:string, link:string}){
    this.items1.push({
      name: data.name,
      link: data.link
    })
  }

}
