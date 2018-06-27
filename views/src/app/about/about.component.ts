import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  href: string;
  footer;
  constructor(private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    if (this.href.endsWith("US"))
      this.footer = true;
  }

}