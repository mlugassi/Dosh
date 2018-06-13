import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import Inbox from '../../models/Blog';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  constructor(private appService: AppService) { }
  inbox:Inbox[];
  ngOnInit() {
    this.appService.get_inbox()
      .subscribe(res => {
        alert(res.inbox[0]);
        alert("before");
        this.inbox = res;
        alert("after");
        alert(res[0].sender);
      });

    (this.inbox).forEach(element => {
      alert(element.title);
    });
  }

}
