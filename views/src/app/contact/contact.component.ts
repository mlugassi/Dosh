import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  href: string;
  footer;
  constructor(private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    if (this.href.endsWith("US"))
      this.footer = true;
  }
  submit()
  {
    alert("Thank you for the message\nWe will back to you soon as possible");
  }

}
