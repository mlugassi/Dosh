import { Component, OnInit } from '@angular/core';
// import CardComponent from '../catalog/card/card.component'
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
        //this.todosList.push(res.data)
        //assign the todolist property to the proper http response
        this.items = [];

        res.forEach(element => {
          this.items.push(element);
        });
      })
  }
}


