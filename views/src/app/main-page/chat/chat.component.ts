import { Component, OnInit, HostListener } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import Chat from '../../models/Chat';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../services/app.service';
import Message from '../../models/Message';
import * as $ from 'jquery';

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
    srchExp: string;
    myChats: Chat[];
    otherChats: { chat: Chat, toJoin: Boolean }[];
    activeChatMsgs: Message[];
    connectedUsers: Chat[];
    userMode: Boolean;
    file: File;

    // @HostListener('window:beforeunload', ['$event'])
    // beforeUnloadHander(event) {
    //     this.ngOnDestroy();
    // }

    constructor(private chatService: ChatService, private appService: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                if (!this.activeChat || data.room != this.activeChat.id) return;
                let message = new Message();
                message.text = data.user + " is joing to the room.";
                message.isJoinMessage = true;
                this.activeChatMsgs.push(message);
            });
        this.chatService.nextSlice()
            .subscribe(data => {
                var fileReader = new FileReader();
                var place = data.currentSlice * 100000,
                    slice = this.file.slice(place, place + Math.min(100000, this.file.size - place));
                fileReader.readAsArrayBuffer(slice);
                fileReader.onload = (evt) => {
                    var arrayBuffer = fileReader.result;
                    this.chatService.uploadImage({
                        name: data.fileName,
                        type: this.file.type,
                        size: this.file.size,
                        data: arrayBuffer
                    })
                }
            })
        chatService.endUpload()
            .subscribe(() => {
                $('#sndBtn').prop('disabled', false);
                $('#imgBtn').prop('disabled', false);
                this.file = null;
            })
        this.chatService.connectedUsers()
            .subscribe(data => {
                data.connected_users.forEach(user => {
                    let chat = new Chat();
                    chat.id = (this.currentUser.userName > user.userName) ? this.currentUser.userName + "_" + user.userName : user.userName + "_" + this.currentUser.userName;
                    chat.title = user.userName;
                    chat.imgPath = user.imgPath;
                    this.connectedUsers.push(chat);
                })
            });
        this.chatService.newUserConnected()
            .subscribe(data => {
                let chat = new Chat();
                chat.id = (this.currentUser.userName > data.userName) ? this.currentUser.userName + "_" + data.userName : data.userName + "_" + this.currentUser.userName;
                chat.title = data.userName;
                chat.imgPath = data.imgPath;
                chat.new_messages = 0;
                this.connectedUsers.push(chat);
            });

        this.chatService.disconnectedUser()
            .subscribe(data => {
                this.connectedUsers = this.connectedUsers.filter(user => user.title != data.userName)
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
                if (!this.activeChat || data.room != this.activeChat.id) {
                    var i = this.myChats.find(chat => chat.id == data.room);
                    if (i) i.new_messages++;
                    var j = this.connectedUsers.find(chat => chat.id == data.room);
                    if (j) j.new_messages++;
                }
                //  else if (data.sender != this.currentUser.userName)
                //     this.activeChatMsgs.push(data);
                else {
                    //  this.activeChatMsgs[this.activeChatMsgs.length - 1] = data;
                    this.activeChatMsgs.push(data);
                    if (this.file) {
                        var fileReader = new FileReader(),
                            slice = this.file.slice(0, 100000);

                        fileReader.readAsArrayBuffer(slice);
                        fileReader.onload = (evt) => {
                            var arrayBuffer = fileReader.result;
                            this.chatService.uploadImage({
                                name: data.contentImgPath,
                                type: this.file.type,
                                size: this.file.size,
                                data: arrayBuffer,
                                id: data._id,
                                room: data.room
                            })
                        }
                        $('#sndBtn').prop('disabled', true);
                        $('#imgBtn').prop('disabled', true);
                    }
                }
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
            this.myChats = res.myChats;
            this.currentUser = { userName: res.user, imgPath: res.imgPath };
            this.index = 1;
            this.activeChatMsgs = [];
            this.connectedUsers = [];
            //this.chatsToJoin = [];
            this.otherChats = [];
            this.chatService.createServerConnection({ user: this.currentUser.userName, imgPath: this.currentUser.imgPath });
            res.otherChats.forEach(chat => this.otherChats.push({ chat: chat, toJoin: false }));
            this.myChats.forEach(chat => { this.chatService.joinRoom({ user: this.currentUser.userName, room: chat.id }); chat.new_messages = 0; });
        });
    }
    load_messages() {
        this.appService.load_messages(this.activeChat.id, this.index++, this.srchExp).subscribe(res => {
            if (res) {
                var read_more;
                if (this.activeChatMsgs.length == 0) {
                    read_more = new Message();
                    read_more.isLoadMessage = true;
                    read_more.text = "read more";
                }
                else
                    read_more = this.activeChatMsgs.shift();

                res.reverse().forEach(element => this.activeChatMsgs.unshift(element));
                if (res.length == 5)
                    this.activeChatMsgs.unshift(read_more);
            }
        });
    }
    openChat(chat: Chat, userMode: Boolean = false) {
        if (this.activeChat && chat && this.activeChat.id == chat.id)
            return;
        this.index = 1;
        this.activeChat = chat;
        this.activeChat.new_messages = 0;
        this.userMode = userMode;
        this.activeChatMsgs = [];
        this.load_messages();
    }

    send_message() {
        let message = new Message();
        message.room = this.activeChat.id;
        message.imgPath = this.currentUser.imgPath;
        message.sender = this.currentUser.userName;
        message.text = this.messageInputText;
        if (this.file) {
            message.isImage = true;
            message.contentImgPath = "/images/chat/" + this.activeChat.id + "_" + message.sender + "_" + Date.now() + ".jpg";
        }
        this.chatService.sendMessage(message);
        this.messageInputText = "";
    }
    join() {
        this.chatService.joinRoom({ user: this.currentUser.userName, room: this.activeChat.id });
    }

    leave() {
        this.chatService.leaveRoom({ user: this.currentUser.userName, room: this.activeChat.id });
        this.myChats = this.myChats.filter(chat => chat.id != this.activeChat.id);
    }
    sendJoinReq() {
        this.otherChats.forEach(chat => {
            if (chat.toJoin == true)
                this.appService.join_to_chat(chat.chat.id).subscribe(res => { if (!res.status) alert(res.message); });
            chat.toJoin = false;
        })
    }

    onFileChange(files) {
        this.file = files.item(0);
    }

    search() {
        this.index = 1;
        this.activeChatMsgs = [];
        this.load_messages();
    }

    ngOnDestroy() {
        this.chatService.serverDisconnection({ user: this.currentUser.userName });
        this.myChats.forEach(chat => this.chatService.leaveRoom(chat.id));
    }
}
