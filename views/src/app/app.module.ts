import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { QubicViewComponent } from './qubic-view/qubic-view.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './navbar/login/login.component';
import { AppService } from './services/app.service';

@NgModule({
  declarations: [
    AppComponent,
    QubicViewComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
