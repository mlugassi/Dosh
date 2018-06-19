import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  blogs: Blog[];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_all_blogs().subscribe(res => {
      this.blogs = [];
      res.forEach(blog => {
        blog.created_at = this.setDateString(blog.created_at);
        this.blogs.push(blog);
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