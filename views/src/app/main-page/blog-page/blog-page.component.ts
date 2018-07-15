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
  categories: { [id: string]: number };

  constructor(private appService: AppService) { 
  }

  ngOnInit() {
    this.categories = {};
    this.categories['Economics'] = 0;
    this.categories['Parenting'] = 0;
    this.categories['Political'] = 0;
    this.categories['Pet'] = 0;
    this.categories['Gaming'] = 0;
    this.categories['Nature'] = 0;
    this.categories['Medical'] = 0;
    this.categories['Science'] = 0;
    this.categories['Business'] = 0;
    this.categories['Sport'] = 0;
    this.appService.get_my_blogs().subscribe(res => {
      this.myBlogs = res;
      this.myBlogs.forEach(blog => {
        this.categories[blog.category.valueOf()]++;
      });
    });

    this.appService.get_all_blogs_but_mine().subscribe(res => {
      this.allBlogs = res;
      this.allBlogs.forEach(blog => {
        this.categories[blog.category.valueOf()]++;
      });
    });
  }

  // onCategoryChanged(data: { blogId: Number, category: String }) {
  //   let blog = this.myBlogs.find(blog => blog.id == data.blogId);
  //   this.categories[blog.category.valueOf()]--;
  //   this.categories[data.category.valueOf()]++;
  //   blog.category = data.category;
  // }
  // onBlogAdded(newBlog: Blog) {
  //   this.categories[newBlog.category.valueOf()]++;
  //   this.myBlogs.push(newBlog)
  // }
}
