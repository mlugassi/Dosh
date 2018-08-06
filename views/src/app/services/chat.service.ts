import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable, fromEvent, Observer } from 'rxjs';
import Message from '../models/Message';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket = io('http://localhost:80');
    public stam$: Observable<any>; // error: any

    constructor() { }
    joinRoom(data) {
        // alert(this.socket);
        this.socket.emit('join', data);
    }

    createServerConnection(data) {
        this.socket.emit('serverConnection', data);
    }

    newUserJoined() {
        let observable = new Observable<{ user: String, message: String, room: String }>(observer => {
            this.socket.on('new user joined', (data) => {
                observer.next(data);
            });
            //alert("disconnect 1");

            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    connectedUsers() {
        let observable = new Observable<{ connected_users: { userName: String, imgPath: String }[] }>(observer => {
            this.socket.on('connected users', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    newUserConnected() {
        let observable = new Observable<{ userName: String, imgPath: String }>(observer => {
            this.socket.on('new user connected', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    like(data) {
        //alert("like");
        this.socket.emit('like', data);
    }
    newLike() {
        let observable = new Observable<{ idMessage: String, user: String, flag: boolean }>(observer => {
            this.socket.on('new like', (data) => {
                observer.next(data);
            });
            //alert("disconnect 2");
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }
    unlike(data) {
        //alert("like");
        this.socket.emit('unlike', data);
    }
    newUnlike() {
        let observable = new Observable<{ idMessage: String, user: String, flag: boolean }>(observer => {
            this.socket.on('new unlike', (data) => {
                observer.next(data);
            });
            //alert("disconnect 3");
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    leaveRoom(data) {
        this.socket.emit('leave', data);
    }

    userLeftRoom() {
        let observable = new Observable<{ user: String, message: String }>(observer => {
            this.socket.on('left room', (data) => {
                observer.next(data);
            });
            //alert("disconnect 4");
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }


    sendImgMessage(message) {
        this.socket.emit('ImgMessage', message);
    }
    newImgMessageReceived() {
        let observable = new Observable<Message>(observer => {
            this.socket.on('new ImgMessage', (data) => {
                observer.next(data);
            });
            //alert("disconnect 5");
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }
    sendMessage(message) {
        this.socket.emit('message', message);
    }

    sendPrivateMessage(data) {
        this.socket.emit('privateMessage', data);
    }
    newMessageReceived() {
        let observable = new Observable<Message>(observer => {
            this.socket.on('new message', (data) => {
                observer.next(data);
            });
            //alert("disconnect 5");
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    newPrivateMessageReceived() {
        let observable = new Observable<{ chatID: String, userName: String, message: Message }>(observer => {
            this.socket.on('new private message', (data) => {
                observer.next(data);
            });
            //alert("disconnect 5");
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    uploadImage(message) {
        this.socket.emit('uploadImage', message);
    }
    nextSlice() {
        let observable = new Observable<{ fileName: String, currentSlice: number }>(observer => {
            this.socket.on('request slice upload', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }

    endUpload() {
        let observable = new Observable<{imgPath: String}>(observer => {
            this.socket.on('end upload', () => {
                observer.next();
            });
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }
}
