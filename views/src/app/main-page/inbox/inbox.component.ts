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
        alert(res.inbox[0].title);
        this.inbox = res.inbox;


        for (let index = 0; index < 2; index++) {
          this.inbox[index].date = this.inbox[index].date.substring(11, 16);
        };
      });
  }
}
