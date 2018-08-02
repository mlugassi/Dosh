import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import Chat from '../../models/Chat';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../services/app.service';
import Message from '../../models/Message';
import { element } from 'protractor';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    activeChat: Chat;
    currentUser: { userName: String, imgPath: String };
    index: number;
    messageInputText: String;
    srchExp: String;
    chats: Chat[];
    activeChatMsgs: Message[];
    connectedUsers: Chat[];

    constructor(private chatService: ChatService, private appService: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                if (!this.activeChat || data.room != this.activeChat.id) return;
                let message = new Message();
                message.text = data.user + " is joing to the room.";
                message.isJoinMessage = true;
                this.activeChatMsgs.push(message);
            });

        this.chatService.newPrivateMessageReceived()
            .subscribe(data => {
                if (data.userName != this.currentUser.userName)
                    this.activeChatMsgs.push(data.message);
                else
                    this.activeChatMsgs[this.activeChatMsgs.length - 1] = data.message;
            })
        this.chatService.connectedUsers()
            .subscribe(data => {
                data.connected_users.forEach(user => {
                    let chat = new Chat();
                    chat.id = (this.currentUser.userName > user.userName) ? this.currentUser.userName + "_" + user.userName : user.userName + "_" + this.currentUser.userName;
                    chat.title = user.userName;
                    chat.imgPath = user.imgPath;
                    this.connectedUsers.push(chat);
                }

                )
            });
        this.chatService.newUserConnected()
            .subscribe(data => {
                let chat = new Chat();
                chat.id = (this.currentUser.userName > data.userName) ? this.currentUser.userName + "_" + data.userName : data.userName + "_" + this.currentUser.userName;
                chat.title = data.userName;
                chat.imgPath = data.imgPath;
                this.connectedUsers.push(chat);
            });
        this.chatService.userLeftRoom()
            .subscribe(data => {
                let message = new Message();
                message.text = data.user + " is left the room.";
                message.isJoinMessage = true;
                this.activeChatMsgs.push(message);
            });

        this.chatService.newMessageReceived()
            .subscribe(data => {
                if (data.sender != this.currentUser.userName)
                    this.activeChatMsgs.push(data);
                else
                    this.activeChatMsgs[this.activeChatMsgs.length - 1] = data;
            });
        this.chatService.newLike()
            .subscribe(data => {
                var element = this.activeChatMsgs.find(element => element._id == data.idMessage);
                if (element) {
                    if (data.flag) {
                        element.likes.push(data.user);
                        var i = element.unlikes.indexOf(data.user);
                        i > -1 ? element.unlikes.splice(i, 1) : null;
                    } else {
                        var i = element.likes.indexOf(data.user);
                        element.likes.splice(i, 1);
                    }
                }
            });
        this.chatService.newUnlike()
            .subscribe(data => {
                var element = this.activeChatMsgs.find(element => element._id == data.idMessage);
                if (element) {
                    if (data.flag) {
                        element.unlikes.push(data.user);
                        var i = element.likes.indexOf(data.user);
                        i > -1 ? element.likes.splice(i, 1) : null;
                    } else {
                        var i = element.unlikes.indexOf(data.user);
                        element.unlikes.splice(i, 1);
                    }
                }
            });
    }

    ngOnInit() {
        this.appService.get_chats().subscribe(res => {
            if (!res) return;
            this.chats = res.chats;
            this.currentUser = { userName: res.user, imgPath: res.imgPath };
            this.index = 1;
            this.activeChatMsgs = [];
            this.connectedUsers = [];
            this.chats.forEach(chat => this.chatService.joinRoom({ user: this.currentUser.userName, room: chat.id }));
            this.chatService.createServerConnection({ user: this.currentUser.userName, imgPath: this.currentUser.imgPath });
        });
    }
    first_load() {
        this.appService.get_messages(this.activeChat.id, this.index++).subscribe(res => {
            if (res) {
                this.activeChatMsgs = res;
                var read_more = new Message();
                read_more.isLoadMessage = true;
                read_more.text = "read more";
                this.activeChatMsgs.unshift(read_more);
            }
        });
    }
    load_messages() {
        this.appService.get_messages(this.activeChat.id, this.index++).subscribe(msgs => {
            if (!msgs) return;
            var read_more = this.activeChatMsgs.shift();
            msgs.reverse().forEach(element => this.activeChatMsgs.unshift(element));
            if (msgs.length == 5)
                this.activeChatMsgs.unshift(read_more);
        });
    }
    openChat(chat: Chat) {
        alert(this.activeChat && this.activeChat.id == chat.id);
        if (this.activeChat && this.activeChat.id == chat.id)
            return;
        this.index = 1;
        this.activeChat = chat;
        this.first_load();
    }

    send_message() {
        let message = new Message();
        message.room = this.activeChat.id;
        message.imgPath = this.currentUser.imgPath;
        message.sender = this.currentUser.userName;
        message.text = this.messageInputText;
        this.chatService.sendMessage(message);
        this.activeChatMsgs.push(message);
        this.messageInputText = "";
    }
    join() {
        this.chatService.joinRoom({ user: this.currentUser.userName, room: this.activeChat.id });
    }

    leave() {
        this.chatService.leaveRoom({ user: this.currentUser.userName, room: this.activeChat.id });
    }


    onFileChange(files) {
        alert("need to implement");
    }

    search() {
        this.appService.search_messages(this.activeChat.id, this.srchExp)
            .subscribe(res => {
                if (res)
                    this.activeChatMsgs = res;
            });
    }

}
