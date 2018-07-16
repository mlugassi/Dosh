import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  allBlogs: Blog[];
  filteredBlogs: Blog[][];
  selectedBlogs: Blog[];
  blogs: Blog[];
  pages: number;
  currentPage: number;
  myPosts: Boolean;
  otherPosts: Boolean;
  watcher: String;
  isAdmin: Boolean;
  isBlogger:Boolean;
  inManage: Boolean;
  category: String;


  constructor(private router: Router, private appService: AppService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.appService.get_who_am_I().subscribe(res => {
      if (res.status) {
        this.watcher = res.watcher;
        this.isAdmin = res.isAdmin;
        this.isBlogger = res.isBlogger;
      }
      else
        alert(res.message);
    })
    this.activatedRoute.params.subscribe(params => {
      this.category = params['filter'] || 'All Categories';
      this.inManage = false;
      this.appService.get_all_blogs().subscribe(res => {
        this.allBlogs = res;
        this.showAllPost();
      });
    });
  }

  showAllPost() {
    this.blogs = [];
    this.filteredBlogs = [];
    let counter = 0;
    let page = 0;
    this.allBlogs.filter(blog => { return (this.category == "All Categories" || blog.category == this.category); }).forEach(blog => {
      if (!(counter++ % 9)) {
        page = Math.floor((counter / 10));
        this.filteredBlogs[page] = [];
      }
      this.filteredBlogs[page].push(blog);
    });
    this.pages = (page % 9) + 1;
    this.currentPage = 1;
    this.blogs = this.filteredBlogs[this.currentPage - 1];
    this.selectedBlogs = [];
    this.myPosts = true;
    this.otherPosts = true;
  }

  showOnlyMyPosts() {
    this.blogs = [];
    this.filteredBlogs = [];
    let counter = 0;
    let page = 0;
    this.allBlogs.filter(blog => { return ((this.category == "All Categories" || (blog.category == this.category)) && blog.author == this.watcher); })
      .forEach(blog => {
        if (!(counter++ % 9)) {
          page = Math.floor((counter / 10));
          this.filteredBlogs[page] = [];
        }
        this.filteredBlogs[page].push(blog);
      });
    this.pages = (page % 9) + 1;
    this.currentPage = 1;
    this.blogs = this.filteredBlogs[this.currentPage - 1];
    this.selectedBlogs = [];
    this.myPosts = true;
    this.otherPosts = false;
  }

  showOtherPost() {
    this.blogs = [];
    this.filteredBlogs = [];
    let counter = 0;
    let page = 0;
    this.allBlogs.filter(blog => { return ((this.category == "All Categories" || (blog.category == this.category)) && blog.author != this.watcher); })
      .forEach(blog => {
        if (!(counter++ % 9)) {
          page = Math.floor((counter / 10));
          this.filteredBlogs[page] = [];
        }
        this.filteredBlogs[page].push(blog);
      });
    this.pages = (page % 9) + 1;
    this.currentPage = 1;
    this.blogs = this.filteredBlogs[this.currentPage - 1];
    this.selectedBlogs = [];
    this.myPosts = false;
    this.otherPosts = true;
  }

  filterByCategory() {
    this.blogs = [];
    this.filteredBlogs = [];
    let counter = 0;
    let page = 0;
    this.allBlogs.filter(blog => {
      return ((!(this.myPosts && !this.otherPosts) || (blog.author == this.watcher)) && (!(!this.myPosts && this.otherPosts) || (blog.author != this.watcher)) && (this.category == "All Categories" || blog.category == this.category));
    })
      .forEach(blog => {
        if (!(counter++ % 9)) {
          page = Math.floor((counter / 10));
          this.filteredBlogs[page] = [];
        }
        this.filteredBlogs[page].push(blog);
      });
    this.pages = (page % 9) + 1;
    this.currentPage = 1;
    this.blogs = this.filteredBlogs[this.currentPage - 1];
    this.selectedBlogs = [];
  }

  onCheckChange(data: { blog: Blog, isChecked: boolean }) {
    if (data.isChecked) {
      this.selectedBlogs.push(data.blog);
    } else {
      let idx = this.selectedBlogs.indexOf(data.blog);
      this.selectedBlogs.splice(idx, 1);
    }
  }
  manage() {
    this.inManage = true;
  }
  cancelManage() {
    this.inManage = false;
  }
  delete() {
    if (this.selectedBlogs.length == 0 || !confirm("Do you want delete these posts?\nAre you sure?")) return;
    this.selectedBlogs.forEach(blog => {
      this.appService.delete_blog(blog.id).subscribe(res => {
        if (res.status) {
          let idx = this.allBlogs.indexOf(blog);
          this.allBlogs.splice(idx, 1);
          if (this.myPosts && this.otherPosts)
            this.showAllPost();
          else if (this.myPosts)
            this.showOnlyMyPosts();
          else this.showOtherPost();
        }
        else
          alert(res.message);
      })
    });
  }
  newBlog() {
    this.router.navigate(['/blogs/blog']);
  }
  nextPage() {

    if (this.currentPage < this.pages)
      this.blogs = this.filteredBlogs[this.currentPage++];
    this.selectedBlogs = [];
  }
  prevPage() {
    if (this.currentPage > 1)
      this.blogs = this.filteredBlogs[--this.currentPage - 1];
    this.selectedBlogs = [];
  }
  moveToPage(num) {
    if (num < 0 || num >= this.pages) return;
    this.blogs = this.filteredBlogs[num];
    this.selectedBlogs = [];
    this.currentPage = num + 1;
  }
}