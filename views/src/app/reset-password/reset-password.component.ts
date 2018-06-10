import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';

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

    this.appService.checkUuid(this.uuid)
      .subscribe(res => {
        alert(234234243);
        if (res.status)
          alert(res.status);
        else
          alert("Somthing went wrong..");
      })
  }

  reset() {
    alert("RESET");
  }
  resetPassword() {
    if (this.password == this.confirmPassword)
      this.appService.resetPassword(this.uuid, this.password)
        .subscribe(res => {
          if (res.status)
            alert(res.message);
          else
            alert("Somthing went wrong..");
        })
    else
      alert("The passwords are differents");
  }
}
