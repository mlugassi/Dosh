import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../services/app.service';
import Blog from '../../../models/Blog';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.component.html',
  styleUrls: ['./new-blog.component.css']
})
export class NewBlogComponent implements OnInit {

  imgPath: String;
  title: String;
  content: String;
  category: String;
  file: File;

  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
    this.imgPath = "/images/blogs/default.jpg";
  }

  getFile(event) {
    this.file = event.target.files[0];
  }
  save() {
    alert("!this.sss()");
    if (!this.checkValues()) return;
    this.appService.add_blog(this.title, this.content, this.category).subscribe(res => {
      if (res.status && this.file) {
        let formData = new FormData();
        let id = res.id;
        formData.append('uploadedImg', this.file, res.id + ".jpg");
        this.appService.upload_blog_Image(formData).subscribe(res => {
          if (!res.status)
            alert(res.message);
          else
            this.router.navigate(['/blogs/' + id]);
        });
      }
      else
        alert(res.message);
    });
  }

  checkValues() {
    if (!this.title || this.title.length < 1 || this.title.replace(/\s/g, '') == "") {
      alert("Title must contains content");
      return false;
    }
    if (!this.title || this.title.length > 60) {
      alert("Title length is bigger then 60 letters");
      return false;
    }
    if (!this.content || this.content.length < 100 || this.content.replace(/\s/g, '') == "") {
      alert("Content length mast be at least 100 letters");
      return false;
    }
    if (!this.category || this.category == "Choose Category...") {
      alert("You must choose a category");
      return false;
    }
    if (!this.file) {
      alert("You must upload an image");
      return false;
    }
    return true;
  }
}
