import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../services/app.service';
import Blog from '../../../models/Blog';
import Comment from '../../../models/Comment';
import * as $ from 'jquery';
import Reply from '../../../models/Reply';


@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css']
})
export class BlogContentComponent implements OnInit {

  blog: Blog;
  watcher: String;
  imgPath: String;
  cmtIdx: number;
  date: Date;

  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.appService.get_who_am_I().subscribe(res => {
      this.watcher = res.watcher;
      this.imgPath = res.imgPath;
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
    this.cmtIdx = 0;
    this.date = new Date();
  }

  doLikeBlog() {
    if (this.blog.likes.users.includes(this.watcher)) {
      this.undoLikeBlog();
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
  doUnlikeBlog() {
    if (this.blog.unlikes.users.includes(this.watcher)) {
      alert("asda");
      this.undoUnlikeBlog();
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

  doLikeComment(commentId) {
    if (!commentId || this.blog.comments.comment.find(c => c._id == commentId).likes.users.includes(this.watcher)) {
      this.undoLikeComment(commentId);
      return;
    }
    let comment = this.blog.comments.comment.find(c => c._id == commentId);
    if (comment.unlikes.users.includes(this.watcher)) {
      let idx = comment.unlikes.users.indexOf(this.watcher);
      comment.unlikes.users.splice(idx, 1);
      comment.unlikes.count = comment.unlikes.count.valueOf() - 1;
    }
    comment.likes.count = comment.likes.count.valueOf() + 1;
    comment.likes.users.push(this.watcher);
    this.appService.do_like(this.blog.id, commentId).subscribe(res => {
      alert(res.status);
    });
  }

  doUnlikeComment(commentId) {
    if (!commentId || this.blog.comments.comment.find(c => c._id == commentId).unlikes.users.includes(this.watcher)) {
      this.undoUnlikeComment(commentId);
      return;
    }
    let comment = this.blog.comments.comment.find(c => c._id == commentId);
    if (comment.likes.users.includes(this.watcher)) {
      let idx = comment.likes.users.indexOf(this.watcher);
      comment.likes.users.splice(idx, 1);
      comment.likes.count = comment.likes.count.valueOf() - 1;
    }
    comment.unlikes.count = comment.unlikes.count.valueOf() + 1;
    comment.unlikes.users.push(this.watcher);
    this.appService.do_unlike(this.blog.id, commentId).subscribe(res => {
      alert(res.status);
    });
  }

  doLikeReply(commentId, replyId) {
    if ((!commentId && !replyId) || this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId).likes.users.includes(this.watcher)) {
      this.undoLikeReply(commentId, replyId);
      return;
    }
    let reply = this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId);
    if (reply.unlikes.users.includes(this.watcher)) {
      let idx = reply.unlikes.users.indexOf(this.watcher);
      reply.unlikes.users.splice(idx, 1);
      reply.unlikes.count = reply.unlikes.count.valueOf() - 1;
    }
    reply.likes.count = reply.likes.count.valueOf() + 1;
    reply.likes.users.push(this.watcher);
    this.appService.do_like(this.blog.id, commentId, replyId).subscribe(res => {
      alert(res.status);
    });
  }
  doUnlikeReply(commentId, replyId) {
    if ((!commentId && !replyId) || this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId).unlikes.users.includes(this.watcher)) {
      this.undoUnlikeReply(commentId, replyId);
      return;
    }
    let reply = this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId);
    if (reply.likes.users.includes(this.watcher)) {
      let idx = reply.likes.users.indexOf(this.watcher);
      reply.likes.users.splice(idx, 1);
      reply.likes.count = reply.likes.count.valueOf() - 1;
    }
    reply.unlikes.count = reply.unlikes.count.valueOf() + 1;
    reply.unlikes.users.push(this.watcher);
    this.appService.do_unlike(this.blog.id, commentId, replyId).subscribe(res => {
      alert(res.status);
    });
  }

  undoLikeBlog() {
    if (!this.blog.likes.users.includes(this.watcher))
      return;
    let idx = this.blog.likes.users.indexOf(this.watcher);
    this.blog.likes.users.splice(idx, 1);
    this.blog.likes.count = this.blog.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blog.id).subscribe(res => {
      alert(res.status);
    });
  }
  undoUnlikeBlog() {
    if (!this.blog.unlikes.users.includes(this.watcher))
      return;
    let idx = this.blog.unlikes.users.indexOf(this.watcher);
    this.blog.unlikes.users.splice(idx, 1);
    this.blog.unlikes.count = this.blog.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blog.id).subscribe(res => {
      alert(res.status);
    });
  }

  undoLikeComment(commentId) {
    if (!commentId || !this.blog.comments.comment.find(c => c._id == commentId).likes.users.includes(this.watcher))
      return;
    let comment = this.blog.comments.comment.find(c => c._id == commentId);
    let idx = comment.likes.users.indexOf(this.watcher);
    comment.likes.users.splice(idx, 1);
    comment.likes.count = comment.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blog.id, commentId).subscribe(res => {
      alert(res.status);
    });
  }

  undoUnlikeComment(commentId) {
    if (!commentId || !this.blog.comments.comment.find(c => c._id == commentId).unlikes.users.includes(this.watcher))
      return;
    let comment = this.blog.comments.comment.find(c => c._id == commentId);
    let idx = comment.unlikes.users.indexOf(this.watcher);
    comment.unlikes.users.splice(idx, 1);
    comment.unlikes.count = comment.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blog.id, commentId).subscribe(res => {
      alert(res.status);
    });
  }

  undoLikeReply(commentId, replyId) {
    if ((!commentId && !replyId) || !this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId).likes.users.includes(this.watcher))
      return;
    let reply = this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId);
    let idx = reply.likes.users.indexOf(this.watcher);
    reply.likes.users.splice(idx, 1);
    reply.likes.count = reply.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blog.id, commentId, replyId).subscribe(res => {
      alert(res.status);
    });
  }
  undoUnlikeReply(commentId, replyId) {
    if ((!commentId && !replyId) || !this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId).unlikes.users.includes(this.watcher))
      return;
    let reply = this.blog.comments.comment.find(c => c._id == commentId).replies.find(r => r._id == replyId);
    let idx = reply.unlikes.users.indexOf(this.watcher);
    reply.unlikes.users.splice(idx, 1);
    reply.unlikes.count = reply.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blog.id, commentId, replyId).subscribe(res => {
      alert(res.status);
    });
  }

  addComment() {
    let content = $('textarea#cmt').val() as String;
    if (content.replace(/\s/g, '') == "") return;
    let comment = new Comment("newCmt" + this.cmtIdx++, this.watcher, this.imgPath, content, Date.now().toString());
    this.blog.comments.comment.push(comment);
    $('textarea#cmt').val('');
  }
  addReply(commentId) {
    let content = $("textarea#rply_" + commentId).val() as String;
    let reply = new Reply("newCmt" + this.cmtIdx++, this.watcher, this.imgPath, content, Date.now().toString());
    this.blog.comments.comment.find(c => c._id == commentId).replies.push(reply);
    $("textarea#rply_" + commentId).val('');
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
