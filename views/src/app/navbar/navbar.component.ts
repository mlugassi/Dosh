import { Component, OnInit } from '@angular/core';
import User from '../models/User';
import { AppService } from '../services/app.service';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as crypto from '../../../../node_modules/crypto-js';
import * as md5 from '../../../../node_modules/md5';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User;// = new User("a", "a", "a", "a", "a@walla.com", "Male", "a", true, true, 0, [], "/images/banner1.jpg");
  editPass: Boolean = true;
  image;
  years = [];
  days = [];
  oldPassword;
  password;
  confirmPassword;
  year;
  month;
  day;
  form: FormGroup;
  modal;
  file: File = null;
  unread = false;

  constructor(private appService: AppService, private modalService: NgbModal) { }

  ngOnInit() {
    for (let index = 1900; index <= 2018; index++)
      this.years.push(index);
    for (let index = 1; index < 32; index++)
      this.days.push(index);
    this.load_user();
  }

  load_user() {
    this.appService.get_user()
      .subscribe(res => {
        this.user = res;
        this.day = this.user.birthDay.substring(8, 10);
        this.month = this.user.birthDay.substring(5, 7);
        this.year = this.user.birthDay.substring(0, 4);
        this.image = this.user.imgPath;
        this.user.imgPath = undefined;
      })
  }
  openModal(content) {
    this.load_user();
    this.modal = this.modalService.open(content, { centered: true });
  }
  logout() {
    localStorage.removeItem('DoshUserName');
    localStorage.removeItem('DoshPassword');
  }
  update() {
    if (this.password != this.confirmPassword) {
      this.password = this.confirmPassword = "";
      return alert("not match");
    }
    this.appService.getKey(new User(this.user.userName, ""))
      .subscribe(resKey => {
        if (resKey.status && resKey.key) {
          if (this.password != undefined && this.password != "" &&
            this.oldPassword != undefined && this.oldPassword != "") {
            this.user.password = crypto.AES.encrypt(md5(this.password), resKey.key).toString();
            this.oldPassword = crypto.AES.encrypt(md5(this.oldPassword), resKey.key).toString();
          }
          this.user.birthDay = this.year + "-" + this.month + "-" + this.day;
          this.appService.update_user(this.user, this.oldPassword)
            .subscribe(res => {
              if (res.status != true) {
                if (res.message)
                  alert(res.message);
                else
                  alert("Your updating was failed.");
                return;
              }
              this.uploadImage();
              this.password = this.confirmPassword = this.oldPassword = undefined;
              this.close_modal();
            });
        }
        else
          alert(resKey.message);
      });
  }
  editPassword() {
    this.editPass = !this.editPass;
  }
  removeAccount() {
    this.user.isActive = !this.user.isActive;
  }
  changeBlogger() {
    this.user.isBlogger = !this.user.isBlogger;
  }
  changeInboxCount() {
    if (this.user.inboxCount)
      this.appService.changeInboxCount()
        .subscribe(res => {
          this.user.inboxCount = 0;
        });
  }
  close_modal() {
    this.modal.close();
  }
  uploadImage() {
    //let file; //= $('#uploadedImg').prop('files')[0];
    if (this.file == undefined || this.file == null) return;
    let formData = new FormData();
    formData.append('uploadedImg', this.file, this.user.userName + "_" + Date.now().toString() + ".jpg");
    this.appService.upload_Image(formData).subscribe(res => {
      if (JSON.parse(res).status != "OK") {
        alert(res);
        return;
      }
    });
  }
  onFileChange(files) {//: FileList) {
    this.file = files.item(0);
    var render = new FileReader();
    render.onload = (event: any) => {
      this.image = event.target.result;
    }
    render.readAsDataURL(this.file);
  }
}
