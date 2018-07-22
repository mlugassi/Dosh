import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import Blog from '../../models/Blog';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  allBlogs: Blog[][];
  blogs: Blog[];
  pages: number;
  currentPage: number;
  filter: String;

  constructor(private router: Router, private appService: AppService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.filter = params['filter'] || undefined;
      if (!this.filter)
        this.router.navigate(['/']);

      this.appService.serach(this.filter).subscribe(res => {
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
      });
    });
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
}