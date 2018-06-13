import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  blogs: Blog[];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_blogs().subscribe(res => {
      this.blogs = res;
    }
    )
  }
}