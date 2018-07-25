import { Component, OnInit } from '@angular/core';
import Message from '../../../models/Message';
import { AppService } from '../../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  messages: Message[];
  userName;
  id;
  constructor(private appService: AppService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute
      .params
      .subscribe(params => {
        this.id = params['id'] || '';
        this.appService.get_messages(this.id).subscribe(res => {
          if (res) {
            this.messages = res.messages as Message[];
            this.userName = res.userName;
          }
        });
      });

  }
  like() {

  }
  unlike() {

  }

}