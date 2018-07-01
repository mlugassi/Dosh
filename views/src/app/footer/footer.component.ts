import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }
  href: string;
  about = "about";
  contact = "contact";
  ngOnInit() {
    this.href = this.router.url;
    if (this.href.endsWith("login") || this.href.endsWith("US") ) {
      this.about += "US";
      this.contact += "US";
    }
  }

}
