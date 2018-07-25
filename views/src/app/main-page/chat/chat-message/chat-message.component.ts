import { Component, OnInit } from '@angular/core';
import Message from '../../../models/Message';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  messages: Message[];
  userName;
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_messages(1).subscribe(res => {
      if (res) {
        this.messages = res.messages as Message[];
        this.userName = res.userName;
      }
    });
  }
  like(){

  }
  unlike(){
    
  }

}
