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
  isBlogger: Boolean;
  newCommentText: String;
  editedContent: String;
  category: String;
  editedTitle: String;
  date: Date;
  inEdit: boolean;
  file: File;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.appService.get_who_am_I().subscribe(res => {
      if (!res.status)
        alert(res.message)
      else {
        this.watcher = res.watcher;
        this.imgPath = res.imgPath;
        this.isBlogger = res.isBlogger;
      }
    })
    this.inEdit = false;
    this.activatedRoute
      .params
      .subscribe(params => {
        let blogId = params['id'] || '';
        this.appService.get_blog(blogId).subscribe(res => {
          if (!res) return;
          this.blog = res;
          this.category = res.category;
        });
      });
    this.date = new Date();
  }

  delete() {
    if (!this.isBlogger) {
      alert("You have no permissions to delete this blog");
      return;
    }
    if (!confirm("Do you want delete this blog?\nAre you sure?")) return;
    this.appService.delete_blog(this.blog.id).subscribe(res => {
      if (res.status)
        this.router.navigate(['/blogs']);
      else
        alert(res.message);
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
    this.appService.update_blog(this.blog.id, this.editedTitle, this.editedContent, this.category).subscribe(res => {
      if (res.status) {
        this.blog.title = this.editedTitle;
        this.blog.content = this.editedContent;
        this.blog.category = this.category;
        if (this.file) {
          let formData = new FormData();
          formData.append('uploadedImg', this.file, this.blog.id + ".jpg");
          this.appService.upload_blog_Image(formData).subscribe(res => {
            if (!res.status)
              alert(res.message);
          });
        }
      }
      else
        alert(res.message);
    });
    this.inEdit = false;
  }
  checkValues() {

    if (this.blog.author != this.watcher) {
      alert("You have no permissions to change this blog");
      return false;
    }
    if (!this.editedTitle || this.editedTitle.length < 1 || this.editedTitle.replace(/\s/g, '') == "") {
      alert("Title must contains content");
      return false;
    }
    if (!this.editedTitle || this.editedTitle.length > 60) {
      alert("Title length is bigger then 60 letters");
      return false;
    }
    if (!this.editedContent || this.editedContent.length < 100 || this.editedContent.replace(/\s/g, '') == "") {
      alert("Content length mast be at least 100 letters");
      return false;
    }
    if (!this.category || this.category == "Choose Category...") {
      alert("You must choose a category");
      return false;
    }
    if (this.editedTitle == this.blog.title && this.editedContent == this.blog.content && this.blog.category == this.category && !this.file) {
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
      if (!res.status)
        alert(res.message);
    });
  }
  doUnlike() {
    if (this.blog.unlikes.users.includes(this.watcher)) {
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
      if (!res.status)
        alert(res.message);
    });
  }

  undoLike() {
    if (!this.blog.likes.users.includes(this.watcher))
      return;
    let idx = this.blog.likes.users.indexOf(this.watcher);
    this.blog.likes.users.splice(idx, 1);
    this.blog.likes.count = this.blog.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blog.id).subscribe(res => {
      if (!res.status)
        alert(res.message);
    });
  }
  undoUnlike() {
    if (!this.blog.unlikes.users.includes(this.watcher))
      return;
    let idx = this.blog.unlikes.users.indexOf(this.watcher);
    this.blog.unlikes.users.splice(idx, 1);
    this.blog.unlikes.count = this.blog.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blog.id).subscribe(res => {
      if (!res.status)
        alert(res.message);
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
