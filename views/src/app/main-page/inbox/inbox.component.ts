import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  constructor(private appService: AppService) { }
inbox;
  ngOnInit() {
    alert("here");
    this.appService.get_inbox()
      .subscribe(res => {
        this.inbox = res;
      })
      this.inbox.forEach(element => {
        alert(element.title);
      });
  }

}
