import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppService } from './services/app.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CardComponent } from './catalog/card/card.component';
import { UsersComponent } from './users/users.component';
import { DefaultComponent } from './default/default.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CatalogComponent,
    CardComponent,
    UsersComponent,
    DefaultComponent,
    ResetPasswordComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
