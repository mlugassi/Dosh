import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  constructor() { }
  
  hide=false;
  ngOnInit() {
  }

  switch()
  {
    this.hide=!this.hide;
  }
}
