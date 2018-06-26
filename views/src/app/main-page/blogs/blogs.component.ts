import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  allBlogs: Blog[][];
  selectedBlogs: Blog[];
  blogs: Blog[];
  pages: number;
  currentPage: number;
  myPosts: Boolean;
  otherPosts: Boolean;
  watcher: String;
  isAdmin: Boolean;
  inManage: Boolean;


  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
    this.appService.get_who_am_I().subscribe(res => {
      this.watcher = res.watcher;
      this.isAdmin = res.isAdmin;
    })
    this.inManage = false;
    this.selectedBlogs = [];
    this.showAllPost();
  }
  nextPage() {

    if (this.currentPage < this.pages)
      this.blogs = this.allBlogs[this.currentPage++];
  }
  prevPage() {
    if (this.currentPage > 1)
      this.blogs = this.allBlogs[--this.currentPage - 1];
  }
  moveToPage(num) {

    if (num < 0 || num >= this.pages) return;
    this.blogs = this.allBlogs[num];
    this.currentPage = num + 1;
  }
  newBlog() {
    this.router.navigate(['/blogs/blog']);
  }
  showOnlyMyPosts() {
    this.appService.get_my_blogs().subscribe(res => {
      this.blogs = [];
      this.allBlogs = [];
      let counter = 0;
      let page = 0;
      res.forEach(blog => {
        if (!(counter++ % 9)) {
          page = Math.floor((counter / 10));
          this.allBlogs[page] = [];
        }
        this.allBlogs[page].push(blog);
      });
      this.pages = (page % 9) + 1;
      this.currentPage = 1;
      this.blogs = this.allBlogs[this.currentPage - 1];
      this.myPosts = true;
      this.otherPosts = false;
    });
  }
  showAllPost() {
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
        this.allBlogs[page].push(blog);
      });
      this.pages = (page % 9) + 1;
      this.currentPage = 1;
      this.blogs = this.allBlogs[this.currentPage - 1];
      this.myPosts = true;
      this.otherPosts = true;
    });
  }
  showOtherPost() {
    this.appService.get_all_blogs_but_mine().subscribe(res => {
      this.blogs = [];
      this.allBlogs = [];
      let counter = 0;
      let page = 0;
      res.forEach(blog => {
        if (!(counter++ % 9)) {
          page = Math.floor((counter / 10));
          this.allBlogs[page] = [];
        }
        this.allBlogs[page].push(blog);
      });
      this.pages = (page % 9) + 1;
      this.currentPage = 1;
      this.blogs = this.allBlogs[this.currentPage - 1];
      this.myPosts = false;
      this.otherPosts = true;
    });
  }
  manage() {
    this.inManage = true;
  }
  cancelManage() {
    this.inManage = false;
  }

  onCheckChange(data: { blog: Blog, isChecked: boolean }) {
    if (data.isChecked) {
      this.selectedBlogs.push(data.blog);
    } else {
      let idx = this.selectedBlogs.indexOf(data.blog);
      this.selectedBlogs.splice(idx, 1);
    }
  }
  delete() {
    this.selectedBlogs.forEach(blog => {
      this.appService.delete_blog(blog.id).subscribe(res => {
        alert("bb");
        alert("aa " + res.status);

        if (res.status)
          this.allBlogs.forEach(blogArray => {
            let idx = blogArray.indexOf(blog);
            blogArray.splice(idx, 1);
          })
      });
    });
  }
  sortByTitle() {

  }
}