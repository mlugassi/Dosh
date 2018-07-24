import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import Chat from '../../models/Chat';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {

    user: String;
    room: String;
    messageText: String;
    chats: Chat[];
    messageArray: Array<{ user: String, message: String }> = [];
    constructor(private chatService: ChatService, private appService: AppService) {

        this.chatService.newUserJoined()
            .subscribe(data => this.messageArray.push(data));

        this.chatService.userLeftRoom()
            .subscribe(data => this.messageArray.push(data));

        this.chatService.newMessageReceived()
            .subscribe(data => this.messageArray.push(data));
    }

    ngOnInit() {
        this.appService.get_chats().subscribe(res => {
            if (res) 
                this.chats = res;
        });
    }
    openChat(){
        alert("openChat");
    }
    join() {
        this.chatService.joinRoom({ user: this.user, room: this.room });
    }

    leave() {
        this.chatService.leaveRoom({ user: this.user, room: this.room });
    }

    sendMessage() {
        this.chatService.sendMessage({ user: this.user, room: this.room, message: this.messageText });
    }

}
