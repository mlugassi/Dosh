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
export class ChatComponent implements OnInit, AfterViewChecked {
    user: String;
    index: number = 1;
    room: String;
    message: Message;
    imgPath: String;
    text: String;
    expression: String;
    chats: Chat[];
    messages: Message[] = [];
    connectedUsers: { userName: String, imgPath: String }[];
    disableScrollDown = false;
    constructor(private chatService: ChatService, private appService: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                if (data.room != this.room) return;
                this.message = new Message();
                this.message.text = data.user + " is joing to the room.";
                this.message.isJoinMessage = true;
                this.messages.push(this.message);
            });
        this.chatService.connectedUsers()
            .subscribe(data => {
                this.connectedUsers = data.connected_users;
            });
        this.chatService.newUserConnected()
            .subscribe(data => {
                this.connectedUsers.push(data);
            });
        this.chatService.userLeftRoom()
            .subscribe(data => {
                this.message = new Message();
                this.message.text = data.user + " is left the room.";
                this.message.isJoinMessage = true;
                this.messages.push(this.message);
            });

        this.chatService.newMessageReceived()
            .subscribe(data => {
                if (data.sender != this.user) {
                    this.message = data as Message;
                    this.messages.push(this.message);
                    this.scrollToBottom();
                }
                else {
                    this.messages[this.messages.length - 1] = data;
                }
            });
        this.chatService.newLike()
            .subscribe(data => {
                var element = this.messages.find(element => element._id == data.idMessage);
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
                var element = this.messages.find(element => element._id == data.idMessage);
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
            if (res) {
                this.chats = res.chats;
                this.user = res.user;
                this.chats.forEach(chat => this.chatService.joinRoom({ user: this.user, room: chat.id }));
                this.imgPath = res.imgPath;
                this.chatService.createServerConnection({ user: this.user, imgPath: this.imgPath });
            }
        });
        this.activatedRoute
            .params
            .subscribe(params => {
                this.room = params['id'] || '';
                this.first_load();
            });
    }
    first_load() {
        this.appService.get_messages(this.room, this.index++).subscribe(res => {
            if (res) {
                this.messages = res;
                var read_more = new Message();
                read_more.isLoadMessage = true;
                read_more.text = "read more";
                this.messages.unshift(read_more);
            }
        });
    }
    load_messages() {
        this.appService.get_messages(this.room, this.index++).subscribe(res => {
            if (res) {
                var msgs = res;
                var read_more = this.messages.shift();
                msgs.reverse().forEach(element => this.messages.unshift(element));
                if (msgs.length == 5)
                    this.messages.unshift(read_more);

                //this.scrollToBottom();
            }
        });
    }
    openChat(id: Number) {
        if (this.room && this.room == id.toString())
            return;
        // if (this.room)
        //     this.leave();
        this.index = 1;
        this.room = id.toString();
        this.router.navigate(['chat/' + id]);
    }
    send_message() {
        this.message = new Message();
        this.message.room = this.room;
        this.message.imgPath = this.imgPath;
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
        this.scrollToBottom();
    }

    onFileChange(files) {
        alert("need to implement");
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private onScroll() {
        let element = this.myScrollContainer.nativeElement
        let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
        if (this.disableScrollDown && atBottom) {
            this.disableScrollDown = false
        } else {
            this.disableScrollDown = true
        }
    }


    private scrollToBottom(): void {
        if (this.disableScrollDown) {
            return
        }
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    search() {
        this.appService.search_messages(this.room, this.expression)
            .subscribe(res => {
                if (res)
                    this.messages = res;
            });
    }

}
