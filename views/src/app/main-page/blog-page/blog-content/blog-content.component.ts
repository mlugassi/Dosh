import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../services/app.service';
import Blog from '../../../models/Blog';
import Comment from '../../../models/Comment';

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css']
})
export class BlogContentComponent implements OnInit {

  blog: Blog;
  watcher: String;
  imgPath: String;
  newCommentText: String;
  editedContent: String;
  editedTitle: String;
  date: Date;
  inEdit: boolean;
  file: File;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.appService.get_who_am_I().subscribe(res => {
      this.watcher = res.watcher;
      this.imgPath = res.imgPath;
    })
    this.inEdit = false;
    this.activatedRoute
      .params
      .subscribe(params => {
        let blogId = params['id'] || '';
        this.appService.get_blog(blogId).subscribe(res => {
          this.blog = res;
        });
      });
    this.date = new Date();
  }

  delete() {
    if (!confirm("Do you want delete this blog?\nAre you sure?")) return;
    this.appService.delete_blog(this.blog.id).subscribe(res => {
      if (res.status)
        this.router.navigate(['/blogs']);
      else alert("Somthing went worng...");
    });
  }

  edit() {
    this.inEdit = true;
    this.editedTitle = this.blog.title;
    this.editedContent = this.blog.content;
  }

  cancel() {
    this.editedTitle = this.blog.title;
    this.editedContent = this.blog.content;
    this.inEdit = false;
  }
  getFile(event) {
    this.file = event.target.files[0];
  }
  save() {
    if (!this.checkValues()) return;
    this.appService.update_blog(this.blog.id, this.editedTitle, this.editedContent).subscribe(res => {
      if (res.status) {
        this.blog.title = this.editedTitle;
        this.blog.content = this.editedContent;
        if (this.file) {
          let formData = new FormData();
          formData.append('uploadedImg', this.file, this.blog.id + ".jpg");
          this.appService.upload_blog_Image(formData).subscribe(res => {
            if (!res.status)
              alert("Somthing went worng with the image...");
          });
        }
      }
      else
        alert("Somthing went worng...");
    });
    this.inEdit = false;
  }
  checkValues() {
    if (this.editedTitle.length < 1 || this.editedTitle.replace(/\s/g, '') == "") {
      alert("Title must contains content");
      return false;
    }
    if (this.editedTitle.length > 60) {
      alert("Title length is bigger then 60 letters");
      return false;
    }
    if (this.editedContent.length < 100 || this.editedContent.replace(/\s/g, '') == "") {
      alert("Content length mast be at least 100 letters");
      return false;
    }
    if (this.editedTitle == this.blog.title && this.editedContent == this.blog.content) {
      this.inEdit = false;
      return false;
    }
    return true;
  }

  newBlog() {
    this.router.navigate(['/blogs/blog']);
  }

  doLike() {
    if (this.blog.likes.users.includes(this.watcher)) {
      this.undoLike();
      return;
    }
    if (this.blog.unlikes.users.includes(this.watcher)) {
      let idx = this.blog.unlikes.users.indexOf(this.watcher);
      this.blog.unlikes.users.splice(idx, 1);
      this.blog.unlikes.count = this.blog.unlikes.count.valueOf() - 1;
    }
    this.blog.likes.count = this.blog.likes.count.valueOf() + 1;
    this.blog.likes.users.push(this.watcher);
    this.appService.do_like(this.blog.id).subscribe(res => {
      alert(res.status);
    });
  }
  doUnlike() {
    if (this.blog.unlikes.users.includes(this.watcher)) {
      alert("asda");
      this.undoUnlike();
      return;
    }
    if (this.blog.likes.users.includes(this.watcher)) {
      let idx = this.blog.likes.users.indexOf(this.watcher);
      this.blog.likes.users.splice(idx, 1);
      this.blog.likes.count = this.blog.likes.count.valueOf() - 1;
    }
    this.blog.unlikes.count = this.blog.unlikes.count.valueOf() + 1;
    this.blog.unlikes.users.push(this.watcher);
    this.appService.do_unlike(this.blog.id).subscribe(res => {
      alert(res.status);
    });
  }

  undoLike() {
    if (!this.blog.likes.users.includes(this.watcher))
      return;
    let idx = this.blog.likes.users.indexOf(this.watcher);
    this.blog.likes.users.splice(idx, 1);
    this.blog.likes.count = this.blog.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blog.id).subscribe(res => {
      alert(res.status);
    });
  }
  undoUnlike() {
    if (!this.blog.unlikes.users.includes(this.watcher))
      return;
    let idx = this.blog.unlikes.users.indexOf(this.watcher);
    this.blog.unlikes.users.splice(idx, 1);
    this.blog.unlikes.count = this.blog.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blog.id).subscribe(res => {
      alert(res.status);
    });
  }

  addComment() {
    if (this.newCommentText.replace(/\s/g, '') == "") return;
    let date = Date.now();
    this.appService.add_comment(this.blog.id, this.newCommentText, this.imgPath, date).subscribe(res => {
      if (res.status) {
        this.blog.comments.comment.push(new Comment(res._id, this.watcher, this.imgPath, this.newCommentText, date.toString()));
        this.blog.comments.count = this.blog.comments.count.valueOf() + 1;
      }
      this.newCommentText = "";
    });
  }

  onReplyAddedSuccessfully() {
    this.blog.comments.count = this.blog.comments.count.valueOf() + 1;
  }
}
