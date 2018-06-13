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
      });
    (this.inbox).forEach(element => {
      if (element.date.getDay() == new Date().getDay())
        element.toStringDate = element.date.getHours() + ":" + element.date.getMinutes();
      else
        element.toStringDate = element.date.getDay().toString();

    });
  }

}
