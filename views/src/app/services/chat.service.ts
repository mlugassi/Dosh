import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';
import Message from '../models/Message';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket = io('http://localhost:80');
    constructor() { }
    joinRoom(data) {
        this.socket.emit('join', data);
    }

    newUserJoined() {
        let observable = new Observable<{ user: String, message: String }>(observer => {
            this.socket.on('new user joined', (data) => {
                alert("new user joined");
                observer.next(data);
            });
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
                alert(data.room);
                observer.next(data);
            });
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
                alert("new message");
                alert(data);
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }
}
