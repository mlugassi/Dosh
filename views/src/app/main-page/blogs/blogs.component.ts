import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  allBlogs: Blog[][];
  blogs: Blog[];
  pages: number;
  currentPage: number;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_all_blogs().subscribe(res => {
      this.blogs = [];
      this.allBlogs = [];
      let counter = 0;
      let page = 0;
      res.forEach(blog => {
        if (!(counter++ % 9)) {
          page = Math.floor((counter / 10));
          this.allBlogs[page] = [];
        }
        blog.created_at = this.setDateString(blog.created_at);
        this.allBlogs[page].push(blog);
      });
      this.pages = (page % 9) + 1;
      this.currentPage = 1;
      this.blogs = this.allBlogs[this.currentPage - 1];
    });
  }
  nextPage() {

    if (this.currentPage < this.pages)
      this.blogs = this.allBlogs[this.currentPage++];
      alert(this.currentPage);
  }
  prevPage() {
    if (this.currentPage > 1)
      this.blogs = this.allBlogs[--this.currentPage - 1];
      alert(this.currentPage);

  }
  moveToPage(num) {

    if (num < 0 || num >= this.pages) return;
    this.blogs = this.allBlogs[num];
    this.currentPage = num + 1;
    alert(this.currentPage);

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