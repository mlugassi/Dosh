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
  ngOnInit() {
    this.appService.get_inbox()
      .subscribe(res => {
        this.inbox = res;


        for (let index = 0; index < 2; index++) {
          this.inbox[index].date = this.inbox[index].date.substring(11, 16);
          this.inbox[index].id = "Stam" + index.toString();
          this.inbox[index].id2 = "#" + this.inbox[index].id
        };
      });
  }
  confirm(id) {
    alert("confirm" + id);
  }
  reject(id) {
    alert("reject" + id);
  }
}
