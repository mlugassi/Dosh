import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items1 = [
    { link: "index.html", name: 'Home' },
    { link: "shop.html", name: 'Catalog' },
    { link: "sale.html", name: 'Manage users' },
    { link: "about.html", name: 'Manage items' },
    { link: "about.html", name: 'About' },
    { link: "contact.html", name: 'Contact' }
  ];
  items2 = [
    { link: "#", name: ' Sign Up' , class:"glyphicon glyphicon-user", modal:'#signupModal' , target:'data-target'},
    { link: "#", name: ' Login' , class:"glyphicon glyphicon-log-in" , modal:'#loginModal', target:'data-target'},
    { link: "#", name: ' Logout' , class:"glyphicon glyphicon-log-out", modal:'#loginModal', target:'data-target'},
  ];
  constructor() { }

  ngOnInit() {

  }

}
