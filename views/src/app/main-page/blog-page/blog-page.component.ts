import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent implements OnInit {

  myBlogs: Blog[];
  allBlogs: Blog[];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_my_blogs().subscribe(res => {
      this.myBlogs = res;
    });

    this.appService.get_all_blogs_but_mine().subscribe(res => {
      this.allBlogs = res;
    });
  }
}
