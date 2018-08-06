import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Inbox from '../../models/Inbox';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  constructor(private appService: AppService) { }
  inbox: Inbox[];
  CheckAll: boolean = false;
  NotInboxMessage = "";

  ngOnInit() {
    this.appService.get_inbox()
      .subscribe(res => {
        if (res.length == 0)
          this.NotInboxMessage = "Not have any Inbox to show.";
        else {
          this.inbox = res.reverse();
          var d = new Date();
          for (let index = 0; index < this.inbox.length; index++) {
            this.inbox[index].id = "#" + this.inbox[index]._id;
            this.inbox[index].isChecked = false;
            if (!(this.inbox[index].isRead))
              this.inbox[index].class = "unread";
            this.inbox[index].index = index;
          };
        }
      });
  }
  confirm(index: number) {
    if (confirm("Are you sure that you want to confirm the request?"))
      this.appService.confirmInbox(this.inbox[index]._id,this.inbox[index].kind)
        .subscribe(res => {
          if (res.status)
            this.inbox[index].isConfirm = true;
          else
            alert(res.message);
        });
  }
  reject(index: number) {
    if (confirm("Are you sure that you want to reject the request?"))
      this.appService.rejectInbox(this.inbox[index]._id)
        .subscribe(res => {
          if (res.status)
            this.inbox[index].isConfirm = true;
          else
            alert(res.message);
        });
  }
  read(index: number) {
    if (index != undefined) {
      if (this.inbox[index].isRead == false)
        this.appService.readInbox(this.inbox[index]._id)
          .subscribe(res => {
            if (res.status) {
              this.inbox[index].class = "";
              this.inbox[index].isRead = true;
            }
            else
              alert(res.message);
          });
    }
    else {
      for (let index = 0; index < this.inbox.length; index++) {
        if (this.inbox[index].isChecked == true && this.inbox[index].isRead == false) {
          this.appService.readInbox(this.inbox[index]._id)
            .subscribe(res => {
              if (res.status) {
                this.inbox[index].class = "";
                this.inbox[index].isRead = true;
              }
              else
                alert(res.message);
            });
        }
        this.inbox[index].isChecked = false;
      }
      this.CheckAll = false;
    }
  }
  unread() {
    for (let index = 0; index < this.inbox.length; index++) {
      if (this.inbox[index].isChecked == true && this.inbox[index].isRead == true) {
        this.appService.unreadInbox(this.inbox[index]._id)
          .subscribe(res => {
            if (res.status) {
              this.inbox[index].class = "unread";
              this.inbox[index].isRead = false;
            }
            else
              alert(res.message);
          });
      }
      this.inbox[index].isChecked = false;
    }
    this.CheckAll = false;
  }
  delete() {
    if (confirm("Are you sure that you want to remove this inbox?")) {
      for (let index = 0; index < this.inbox.length; index++) {
        if (this.inbox[index].isChecked == true) {
          //delete from the list

          this.appService.delete_inbox(this.inbox[index]._id)
            .subscribe(res => {
              if (res.status)
                this.inbox.splice(index, 1);
              else
                alert(res.message);
            });
        }
      }
      this.CheckAll = false;
    }
  }
  checkAll() {
    this.CheckAll = !this.CheckAll;
    if (this.CheckAll)
      for (let index = 0; index < this.inbox.length; index++)
        this.inbox[index].isChecked = true;
    else
      for (let index = 0; index < this.inbox.length; index++)
        this.inbox[index].isChecked = false;
  }
  onSelectionChange(index) {
    this.inbox[index].isChecked = !this.inbox[index].isChecked;
  }
}
