import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../services/app.service';
import { FormGroup } from '@angular/forms';
import * as crypto from '../../../../../node_modules/crypto-js';
import * as md5 from '../../../../../node_modules/md5';
import User from '../../models/User'

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    users: User[];
    selectedUser: User;
    isBlogger: Boolean;
    isAdmin: Boolean;
    user: User;
    editPass: Boolean;
    watcher: String;
    image: String;
    years = [];
    days = [];
    oldPassword: String;
    password: String;
    confirmPassword: String;
    year: String;
    month: String;
    day: String;
    form: FormGroup;
    modal;
    file: File;

    constructor(private appService: AppService, private modalService: NgbModal) {
    }

    ngOnInit() {
        this.appService.get_who_am_I().subscribe(res => {
            if (!res.status)
                alert(res.message)
            else {
                this.watcher = res.watcher;
            }
        })
        for (let index = 1900; index <= 2018; index++)
            this.years.push(index);
        for (let index = 1; index < 32; index++)
            this.days.push(index);
        this.appService.get_users()
            .subscribe(res => {
                this.users = res;
            })
    }

    load_user(userName) {
        this.selectedUser = this.users.filter(usr => usr.userName == userName)[0];
        if (!this.selectedUser) return alert("User doesn't exits");
        this.user = {} as User;
        this.copyUser(this.selectedUser, this.user);
        this.day = this.user.birthDay.substring(8, 10);
        this.month = this.user.birthDay.substring(5, 7);
        this.year = this.user.birthDay.substring(0, 4);
        this.image = this.user.imgPath;
    }

    copyUser(src: User, tar: User) {
        tar.birthDay = src.birthDay;
        tar.blogs = src.blogs;
        tar.email = src.email;
        tar.firstName = src.firstName;
        tar.gender = src.gender;
        tar.imgPath = src.imgPath;
        tar.inbox = src.inbox;
        tar.inboxCount = src.inboxCount;
        tar.isActive = src.isActive;
        tar.isAdmin = src.isAdmin;
        tar.isBlogger = src.isBlogger;
        tar.lastName = src.lastName;
        tar.password = src.password;
        tar.userName = src.userName;
    }

    openModal(content, userName) {
        this.editPass = false;
        this.load_user(userName);
        this.modal = this.modalService.open(content, { centered: true });
    }

    deleteUser(userName) {
        this.appService.delete_user(userName)
            .subscribe(res => {
                if (!res.status)
                    return alert(res.message);

                let tempUsers = [];
                this.users.forEach(user => {
                    alert(user.userName);
                    if (user.userName != userName) {
                        tempUsers.push(user);
                    }
                });
                this.users = tempUsers;
            });
    }
    update() {
        if (!this.checkValues()) return;
        this.appService.getKey(new User(this.user.userName, ""))
            .subscribe(resKey => {
                if (resKey.status && resKey.key) {
                    if (this.watcher == this.user.userName)
                        this.oldPassword = crypto.AES.encrypt(md5(this.oldPassword), resKey.key).toString();
                    if (this.editPass)
                        this.user.password = crypto.AES.encrypt(md5(this.password), resKey.key).toString();
                    this.user.birthDay = this.year + "-" + this.month + "-" + this.day;
                    this.appService.update_user(this.user, this.oldPassword)
                        .subscribe(res => {
                            if (!res.status)
                                return alert(res.message);
                            this.uploadImage();
                            this.copyUser(this.user, this.selectedUser);
                            this.selectedUser.imgPath = this.image;
                            this.close_modal();
                        });
                }
                else
                    alert(resKey.message);
            });
    }

    checkValues() {
        if (this.editPass && (this.password != this.confirmPassword || !this.password || !this.confirmPassword)) {
            this.password = this.confirmPassword = "";
            alert("Password and Confirm Password don't match");
            return false;
        }
        if (this.watcher == this.user.userName && this.editPass && !this.oldPassword) {
            this.password = this.confirmPassword = this.oldPassword = "";
            alert("You must to fill Old Password");
            return false;
        }
        if (this.editPass && (this.password == "" || this.confirmPassword == "")) {
            alert("You must to fill Password and Confirm Password");
            return false;
        }
        if (!this.user.userName || !this.user.firstName || !this.user.lastName || !this.user.imgPath || !this.user.birthDay || !this.user.email || !this.user.gender) {
            alert("You must to fill all the fields");
            return false;
        }
        return true;
    }
    close_modal() {
        this.user = this.password = this.confirmPassword = this.oldPassword = undefined;
        this.modal.close();
    }
    uploadImage() {
        if (this.file == undefined || this.file == null) return;
        let formData = new FormData();
        formData.append('uploadedImg', this.file, this.user.userName + "_" + Date.now().toString() + ".jpg");
        this.appService.upload_Image(formData).subscribe(res => {
            if (!res.status) {
                return alert(res);
            }
        });
    }
    onFileChange(files) {
        this.file = files.item(0);
        var render = new FileReader();
        render.onload = (event: any) => {
            this.image = event.target.result;
        }
        render.readAsDataURL(this.file);
    }

    editPassword() {
        this.editPass = !this.editPass;
        if (!this.editPass)
            this.password = this.confirmPassword = this.oldPassword = undefined;
    }
    changeBlogger() {
        this.user.isBlogger = !this.user.isBlogger;
    }

}