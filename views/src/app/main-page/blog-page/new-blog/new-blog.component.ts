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
  file: File;

  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
    this.imgPath = "/images/blogs/default.jpg";
  }

  getFile(event) {
    this.file = event.target.files[0];
  }
  save() {
    this.appService.add_blog(this.title, this.content).subscribe(res => {
      if (res.status && this.file) {
        let formData = new FormData();
        let id = res.id;
        formData.append('uploadedImg', this.file, res.id + ".jpg");
        this.appService.upload_blog_Image(formData).subscribe(res => {
          if (!res.status)
            alert("Somthing went worng with the image...");
          else
            this.router.navigate(['/blogs/' + id]);
        });
      }
      else
        alert("Somthing went worng...");
    });
  }
}
