import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-recent-posts',
  templateUrl: './recent-posts.component.html',
  styleUrls: ['./recent-posts.component.css']
})
export class RecentPostsComponent implements OnInit {

  recentBlogs: Blog[];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_blogs().subscribe(res => {
      this.recentBlogs = res;
    }
    )
  }
}
