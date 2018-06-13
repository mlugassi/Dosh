import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppService } from './services/app.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CardComponent } from './catalog/card/card.component';
import { UsersComponent } from './users/users.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { RecentPostsComponent } from './home/recent-posts/recent-posts.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CatalogComponent,
    CardComponent,
    UsersComponent,
    ResetPasswordComponent,
    PageNotFoundComponent,
    FooterComponent,
    CarouselComponent,
    RecentPostsComponent,
    NavbarComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [AppService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
