import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import Blog from '../../../models/Blog';

@Component({
  selector: 'app-recent-posts',
  templateUrl: './recent-posts.component.html',
  styleUrls: ['./recent-posts.component.css']
})
export class RecentPostsComponent implements OnInit {

  recentBlogs: Blog[];
  mostRecetBlog: Blog;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_recent_posts().subscribe(res => {
      if (res.length > 0) {
        this.mostRecetBlog = res[0];
        res.splice(0, 1);
        this.recentBlogs = res;
      }
    }
    )
  }
}
