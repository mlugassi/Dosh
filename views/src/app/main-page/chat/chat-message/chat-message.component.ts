import { Component, OnInit, Input } from '@angular/core';
import Message from '../../../models/Message';
import { ChatService } from '../../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message;
  @Input() userName: String;
  @Input() room: String;

  id;
  constructor(private chatService: ChatService) { }

  ngOnInit() {



  }
  like(id) {
    if (!this.message.likes.users.find(user => user == this.userName)) {
      this.chatService.like({ idMessage: id, user: this.userName, room: this.room, flag: true });
      this.message.likes.count++;
      this.message.likes.users.push(this.userName);
    }
    else {
      this.chatService.like({ idMessage: id, user: this.userName, room: this.room, flag: false });
      this.message.likes.count--;
      var index = this.message.likes.users.indexOf(this.userName);
      this.message.likes.users.splice(index,1);
    }

  }
  unlike() {

  }

}