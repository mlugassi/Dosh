import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../services/app.service';
import Blog from '../../../models/Blog';

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css']
})
export class BlogContentComponent implements OnInit {

  blog: Blog;
  watcher: String;

  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.appService.get_who_am_I().subscribe(res => {
      this.watcher = res.watcher;
    })
    this.activatedRoute
      .params
      .subscribe(params => {
        let blogId = params['id'] || '';
        this.appService.get_blog(blogId).subscribe(res => {
          this.blog = res;
          this.blog.created_at = this.setDateString(this.blog.created_at);
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
