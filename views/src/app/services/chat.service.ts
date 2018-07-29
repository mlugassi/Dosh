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
        this.socket.emit('join', data);
    }

    newUserJoined() {
        let observable = new Observable<{ user: String, message: String }>(observer => {
            this.socket.on('new user joined', (data) => {
                observer.next(data);
            });
            //alert("disconnect 1");

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

    sendMessage(message) {
        this.socket.emit('message', message);
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
}
