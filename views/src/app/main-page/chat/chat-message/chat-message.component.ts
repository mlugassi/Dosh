import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Output() loadMessage = new EventEmitter();

  id;
  constructor(private chatService: ChatService) { }

  ngOnInit() {



  }
  like(id) {
    if (!this.message.likes.find(user => user == this.userName)) {
      this.chatService.like({ idMessage: id, user: this.userName, room: this.room, flag: true });
      this.message.likes.push(this.userName);
      var index = this.message.unlikes.indexOf(this.userName);
      index > -1 ? this.message.unlikes.splice(index, 1) : null;
    }
    else {
      this.chatService.like({ idMessage: id, user: this.userName, room: this.room, flag: false });
      var index = this.message.likes.indexOf(this.userName);
      this.message.likes.splice(index, 1);
    }
  }
  unlike(id) {
    if (!this.message.unlikes.find(user => user == this.userName)) {
      this.chatService.unlike({ idMessage: id, user: this.userName, room: this.room, flag: true });
      this.message.unlikes.push(this.userName);
      var index = this.message.likes.indexOf(this.userName);
      index > -1 ? this.message.likes.splice(index, 1) : null;
    }
    else {
      this.chatService.unlike({ idMessage: id, user: this.userName, room: this.room, flag: false });
      var index = this.message.unlikes.indexOf(this.userName);
      this.message.unlikes.splice(index, 1);
    }
  }
  isLink(text: string) {
    if (text.startsWith("http://") || text.startsWith("www.")
      || text.endsWith(".com") || text.endsWith(".co.il"))
      return true;
    return false;
  }
  load() {
    this.loadMessage.emit();
  }
}