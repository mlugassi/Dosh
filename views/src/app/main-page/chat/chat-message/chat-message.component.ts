import { Component, OnInit, Input } from '@angular/core';
import Message from '../../../models/Message';
import { AppService } from '../../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message;
  @Input() userName: String;

  //messages: Message[];
  id;
  constructor(private appService: AppService) { }

  ngOnInit() {

    

  }
  like() {

  }
  unlike() {

  }

}