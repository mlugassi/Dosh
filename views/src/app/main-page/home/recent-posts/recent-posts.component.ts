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
  mostRecetBlog: {
    id: number;
    imgPath: String,
    dateString: String,
    likes: number,
    comments: number,
    title: String,
    subTitle: String
  };

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_recent_posts().subscribe(res => {
      this.setMostRecent(res[0]);
      this.recentBlogs = [];
      res.forEach(blog => {
        blog.created_at = this.setDateString(blog.created_at);
        this.recentBlogs.push(blog);
      })

    }
    )
  }

  setMostRecent(blog: Blog) {
    this.mostRecetBlog = {
      id: blog.id.valueOf(),
      imgPath: blog.imgPath,
      dateString: this.setDateString(blog.created_at),
      likes: blog.likes.count.valueOf(),
      title: blog.title,
      subTitle: blog.subTitle,
      comments: blog.comments.count.valueOf()
    };
  }

  setDateString(date) {
    let day = date.substr(8, 2);
    let month = date.substr(5, 2);
    let year = date.substr(0, 4);

    switch (month) {
      case "01": {
        month = "JAN";
        break;
      }
      case "02": {
        month = "FEB";
        break;
      }
      case "03": {
        month = "MAR";
        break;
      }
      case "04": {
        month = "APR";
        break;
      }
      case "05": {
        month = "MAY";
        break;
      }
      case "06": {
        month = "JUN";
        break;
      }
      case "07": {
        month = "JUL";
        break;
      }
      case "08": {
        month = "AUG";
        break;
      }
      case "09": {
        month = "SEP";
        break;
      }
      case "10": {
        month = "OCT";
        break;
      }
      case "11": {
        month = "NOV";
        break;
      }
      case "12": {
        month = "DEC";
        break;
      }
    }
    return day + " " + month + ", " + year;
  }
}
