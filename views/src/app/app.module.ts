import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './navbar/login/login.component';
import { AppService } from './services/app.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CardComponent } from './catalog/card/card.component';
import { UsersComponent } from './users/users.component';
import { DefaultComponent } from './default/default.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    CatalogComponent,
    CardComponent,
    UsersComponent,
    DefaultComponent
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
