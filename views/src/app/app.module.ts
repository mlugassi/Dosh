import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { QubicViewComponent } from './qubic-view/qubic-view.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './navbar/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    QubicViewComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
