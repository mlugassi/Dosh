import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  imgPath:String;
  title:String;
  subTitle:String;
  btnContent:String;
  constructor(imgPath:String , title:String, subTitle:String,btnContent:String) {
    this.imgPath = imgPath;
    this.title = title;
    this.subTitle = subTitle;
    this.btnContent = btnContent;
  }
  ngOnInit() {
    this.imgPath = "http://placehold.it/500x325";
    this.title = "test title";
    this.subTitle = "test sub-title";
    this.btnContent = "test button content";
  }
}
