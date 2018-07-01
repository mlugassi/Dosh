import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import Blog from '../../../models/Blog';

@Component({
  selector: 'app-most-commented',
  templateUrl: './most-commented.component.html',
  styleUrls: ['./most-commented.component.css']
})
export class MostCommentedComponent implements OnInit {

  constructor(private appService: AppService) { }
  blogs: Blog[];
  mostCommentedBlog: Blog;
  ngOnInit() {
    this.appService.most_commented_blogs().subscribe(res => {
      if (res.length > 0) {
        this.mostCommentedBlog = res[0];
        res.splice(0, 1);
        this.blogs = res;
      }
    });
  }

}
