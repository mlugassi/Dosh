import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import Comment from '../../../../models/Comment';
import Reply from '../../../../models/Reply';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() watcher: String;
  @Input() imgPath: String;
  @Input() blogId: Number;
  @Output() replyAddedSuccessfully = new EventEmitter();
  newReplyText: String;
  date: Date;

  constructor(private appService: AppService) { }

  ngOnInit() {
  }
  doLike() {
    if (this.comment.likes.users.includes(this.watcher)) {
      this.undoLike();
      return;
    }
    if (this.comment.unlikes.users.includes(this.watcher)) {
      let idx = this.comment.unlikes.users.indexOf(this.watcher);
      this.comment.unlikes.users.splice(idx, 1);
      this.comment.unlikes.count = this.comment.unlikes.count.valueOf() - 1;
    }
    this.comment.likes.count = this.comment.likes.count.valueOf() + 1;
    this.comment.likes.users.push(this.watcher);
    this.appService.do_like(this.blogId, this.comment._id).subscribe(res => {
      if (!res.status)
        alert(res.message);
    });
  }

  doUnlike() {
    if (this.comment.unlikes.users.includes(this.watcher)) {
      this.undoUnlike();
      return;
    }
    if (this.comment.likes.users.includes(this.watcher)) {
      let idx = this.comment.likes.users.indexOf(this.watcher);
      this.comment.likes.users.splice(idx, 1);
      this.comment.likes.count = this.comment.likes.count.valueOf() - 1;
    }
    this.comment.unlikes.count = this.comment.unlikes.count.valueOf() + 1;
    this.comment.unlikes.users.push(this.watcher);
    this.appService.do_unlike(this.blogId, this.comment._id).subscribe(res => {
      if (!res.status)
        alert(res.message);
    });
  }

  undoLike() {
    if (!this.comment.likes.users.includes(this.watcher))
      return;
    let idx = this.comment.likes.users.indexOf(this.watcher);
    this.comment.likes.users.splice(idx, 1);
    this.comment.likes.count = this.comment.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blogId, this.comment._id).subscribe(res => {
      if (!res.status)
        alert(res.message);
    });
  }

  undoUnlike() {
    if (!this.comment.unlikes.users.includes(this.watcher))
      return;
    let idx = this.comment.unlikes.users.indexOf(this.watcher);
    this.comment.unlikes.users.splice(idx, 1);
    this.comment.unlikes.count = this.comment.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blogId, this.comment._id).subscribe(res => {
      if (!res.status)
        alert(res.message);
    });
  }
  addReply() {
    if (this.newReplyText.replace(/\s/g, '') == "") return;
    let date = Date.now();
    this.appService.add_reply(this.blogId, this.comment._id, this.newReplyText, this.imgPath, date).subscribe(res => {
      if (res.status) {
        this.comment.replies.push(new Reply(res._id, this.watcher, this.imgPath, this.newReplyText, Date.now().toString()));
        this.replyAddedSuccessfully.emit();
      }
      this.newReplyText = "";
    });
  }
}
