import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../../../../services/app.service';
import Reply from '../../../../../models/Reply';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {

  @Input() reply: Reply;
  @Input() watcher: String;
  @Input() imgPath: String;
  @Input() commentId: String;
  @Input() blogId: Number;

  constructor(private appService: AppService) { }



  ngOnInit() {
  }

  doLike() {
    if (this.reply.likes.users.includes(this.watcher)) {
      this.undoLike();
      return;
    }
    if (this.reply.unlikes.users.includes(this.watcher)) {
      let idx = this.reply.unlikes.users.indexOf(this.watcher);
      this.reply.unlikes.users.splice(idx, 1);
      this.reply.unlikes.count = this.reply.unlikes.count.valueOf() - 1;
    }
    this.reply.likes.count = this.reply.likes.count.valueOf() + 1;
    this.reply.likes.users.push(this.watcher);
    this.appService.do_like(this.blogId, this.commentId, this.reply._id).subscribe(res => {
      alert(res.status);
    });
  }
  doUnlike() {
    if (this.reply.unlikes.users.includes(this.watcher)) {
      this.undoUnlike();
      return;
    }
    if (this.reply.likes.users.includes(this.watcher)) {
      let idx = this.reply.likes.users.indexOf(this.watcher);
      this.reply.likes.users.splice(idx, 1);
      this.reply.likes.count = this.reply.likes.count.valueOf() - 1;
    }
    this.reply.unlikes.count = this.reply.unlikes.count.valueOf() + 1;
    this.reply.unlikes.users.push(this.watcher);
    this.appService.do_unlike(this.blogId, this.commentId, this.reply._id).subscribe(res => {
      alert(res.status);
    });
  }
  undoLike() {
    if (!this.reply.likes.users.includes(this.watcher))
      return;
    let idx = this.reply.likes.users.indexOf(this.watcher);
    this.reply.likes.users.splice(idx, 1);
    this.reply.likes.count = this.reply.likes.count.valueOf() - 1;
    this.appService.undo_like(this.blogId, this.commentId, this.reply._id).subscribe(res => {
      alert(res.status);
    });
  }
  undoUnlike() {
    if (!this.reply.unlikes.users.includes(this.watcher))
      return;
    let idx = this.reply.unlikes.users.indexOf(this.watcher);
    this.reply.unlikes.users.splice(idx, 1);
    this.reply.unlikes.count = this.reply.unlikes.count.valueOf() - 1;
    this.appService.undo_unlike(this.blogId, this.commentId, this.reply._id).subscribe(res => {
      alert(res.status);
    });
  }

}
