import { Component, OnInit, Input } from '@angular/core';

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
  constructor() {
  }

   @Input() card: { imgPath: String, title: String, subTitle: String, btnContent: String };

  ngOnInit() {
    this.imgPath = "http://placehold.it/500x325";
    this.title = "test title";
    this.subTitle = "test sub-title";
    this.btnContent = "test button content";
  }
}
