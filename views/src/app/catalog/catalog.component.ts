import { Component, OnInit } from '@angular/core';
import Card from '../models/Card'
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  items: Card[];
  private appService: AppService;
  constructor(appService: AppService) {
    this.appService = appService;
  }
  ngOnInit() {
    this.appService.get_catalog()
      .subscribe(res => {
        this.items = [];
        res.forEach(element => {
          this.items.push(element);
        });
      })
  }
}


