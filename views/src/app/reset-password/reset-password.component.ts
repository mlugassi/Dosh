import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private router: Router,private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.activatedRoute
      .params
      .subscribe(params => {

        this.uuid = params['id'] || '';
      });
  }

  reset() {
    if (this.password == this.confirmPassword) {
      this.appService.getKeyWithUuid(this.uuid)
        .subscribe(resKey => {
          if (resKey.status && resKey.key) {
            this.appService.doReset(this.uuid, (crypto.AES.encrypt(md5(this.password), resKey.key).toString()))
              .subscribe(res => {
                if (res.status)
                this.router.navigate(['/login']);

                  alert(res.message);         
              })
          }
          else
            alert(resKey.message);
        })
    }
    else
      alert("The passwords are differents");
  }
}
