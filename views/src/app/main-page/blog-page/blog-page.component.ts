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
  isClickecd = false;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_my_blogs().subscribe(res => {
      this.myBlogs = [];
      res.forEach(blog => {
        blog.created_at = this.setDateString(blog.created_at);
        this.myBlogs.push(blog);
      })
    });

    this.appService.get_all_blogs_but_mine().subscribe(res => {
      this.allBlogs = [];
      res.forEach(blog => {
        blog.created_at = this.setDateString(blog.created_at);
        this.allBlogs.push(blog);
      });
    });
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
