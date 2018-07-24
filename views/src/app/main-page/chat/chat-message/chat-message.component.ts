import { Component, OnInit } from '@angular/core';
import Comment from '../../../models/Comment';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  messages: Comment[];
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.get_messages(1).subscribe(res => {
      if (res){
        this.messages = res;
      alert(this.messages[0].writer);
      }
    });
  }

}
