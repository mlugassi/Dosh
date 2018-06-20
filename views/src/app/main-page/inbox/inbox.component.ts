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

  ngOnInit() {
    this.appService.get_inbox()
      .subscribe(res => {
        this.inbox = res;
        var d = new Date();
        for (let index = 0; index < this.inbox.length; index++) {
          if (d.getDate() == Number(this.inbox[index].date.substring(8, 10)) &&
            d.getMonth() + 1 == Number(this.inbox[index].date.substring(5, 7)))
            this.inbox[index].date = this.inbox[index].date.substring(11, 16);
          else
            this.inbox[index].date = this.inbox[index].date.substring(8, 10) +
              "/" + this.inbox[index].date.substring(5, 7);
          this.inbox[index].id = "#" + this.inbox[index]._id
          this.inbox[index].isChecked = false;
          if (!(this.inbox[index].isRead))
            this.inbox[index].class = "unread";
          this.inbox[index].index = index;
        };
      });
  }
  confirm(index: number) {
    this.appService.confirmInbox(this.inbox[index]._id)
      .subscribe(res => {
        this.inbox[index].isConfirm = true;
      });
  }
  reject(index: number) {
    this.appService.rejectInbox(this.inbox[index]._id)
      .subscribe(res => {
        this.inbox[index].isConfirm = true;
      });
  }
  read(index: number) {
    if (index != undefined && this.inbox[index].isRead == false) {
      this.appService.readInbox(this.inbox[index]._id)
        .subscribe(res => {
          this.inbox[index].class = "";
          this.inbox[index].isRead = true;
        });
    }
    else {
      for (let index = 0; index < this.inbox.length; index++) {
        if (this.inbox[index].isChecked == true && this.inbox[index].isRead == false) {
          this.inbox[index].class = "";
          this.appService.readInbox(this.inbox[index]._id)
            .subscribe(res => {
              this.inbox[index].isRead = true;
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
        this.inbox[index].class = "unread";
        this.appService.unreadInbox(this.inbox[index]._id)
          .subscribe(res => {
            this.inbox[index].isChecked = false;
            this.inbox[index].isRead = false;
          });
      }
    }
    this.CheckAll = false;
  }
  delete() {
    alert("delete");
    for (let index = 0; index < this.inbox.length; index++) {
      if (this.inbox[index].isChecked == true) {
        alert("inside");
        //delete from the list
        this.appService.delete_inbox(this.inbox[index]._id)
          .subscribe(res => {
            alert(res.status)
          });
      }
    }
    this.CheckAll = false;
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
