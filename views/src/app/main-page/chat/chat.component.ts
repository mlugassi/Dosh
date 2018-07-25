import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import Chat from '../../models/Chat';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../services/app.service';
import Message from '../../models/Message';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {

    user: String;
    room: String;
    message: Message;
    text: String;
    chats: Chat[];
    messages: any[];
    constructor(private chatService: ChatService, private appService: AppService, private router: Router, private activatedRoute: ActivatedRoute) {

        // this.chatService.newUserJoined()
        //     .subscribe(data => this.messages.push(data));

        // this.chatService.userLeftRoom()
        //     .subscribe(data => this.messages.push(data));

        // this.chatService.newMessageReceived()
        //     .subscribe(data => this.messages.push(data));
    }

    ngOnInit() {
        this.appService.get_chats().subscribe(res => {
            if (res)
                this.chats = res as Chat[];
        });

        this.activatedRoute
            .params
            .subscribe(params => {
                this.room = params['id'] || '';
                this.appService.get_messages(this.room).subscribe(res => {
                    if (res) {
                        this.messages = res.messages as Message[];
                        this.user = res.userName;
                    }
                });
            });
    }
    openChat(id: Number) {
        if (this.room && this.room == id.toString())
            return;
        if (this.room)
            this.leave();
        this.room = id.toString();
        this.join();
        this.router.navigate(['chat/' + id]);
    }
    send_message() {
        this.message = new Message();
        //this.message.date = "now";//Date.now().toString();
        //this.message.likes = { count: 0, users: [""] };
        //this.message.unlikes = { count: 0, users: [""] };
        this.message.room = this.room;
        this.message.sender = this.user;
        this.message.text = this.text;
        this.sendMessage();
        this.text = "";
    }
    join() {
        this.chatService.joinRoom({ user: this.user, room: this.room });
    }

    leave() {
        this.chatService.leaveRoom({ user: this.user, room: this.room });
    }

    sendMessage() {
        this.chatService.sendMessage(this.message);
        this.messages.push(this.message);
    }

}
