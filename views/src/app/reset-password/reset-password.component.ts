import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';
import * as crypto from '../../../../node_modules/crypto-js';
import * as md5 from '../../../../node_modules/md5';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password;
  confirmPassword;
  uuid;
  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.activatedRoute
      .params
      .subscribe(params => {

        this.uuid = params['id'] || '';
      });

    // this.appService.checkUuid(this.uuid)
    //   .subscribe(res => {
    //     alert(234234243);
    //     if (res.status)
    //       alert(res.status);
    //     else
    //       alert("Somthing went wrong..");
    //   })
  }

  reset() {
    alert("RESET");
    if (this.password == this.confirmPassword){
      this.appService.getKeyWithUuid(this.uuid)
        .subscribe(resKey => {
          alert(resKey);
          alert(resKey.key);
          this.appService.doReset(this.uuid, (crypto.AES.encrypt(md5(this.password), resKey.key).toString()))
            .subscribe(res => {
              if (res.status)
                alert(res.message);
              else
                alert("Somthing went wrong..");
            })
        })}
    else
      alert("The passwords are differents");
  }
  // resetPassword() {
  //   if (this.password == this.confirmPassword)
  //     this.appService.resetPassword(this.uuid, this.password)
  //       .subscribe(res => {
  //         if (res.status)
  //           alert(res.message);
  //         else
  //           alert("Somthing went wrong..");
  //       })
  //   else
  //     alert("The passwords are differents");
  // }
}