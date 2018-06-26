import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './main-page/home/home.component';
import { LoginComponent } from './login/login.component';
import { AppService } from './services/app.service';
import { UsersComponent } from './main-page/users/users.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CarouselComponent } from './main-page/home/carousel/carousel.component';
import { RecentPostsComponent } from './main-page/home/recent-posts/recent-posts.component';
import { MainPageComponent } from './main-page/main-page.component';
import { InboxComponent } from './main-page/inbox/inbox.component';
import { BlogsComponent } from './main-page/blogs/blogs.component';
import { BlogPageComponent } from './main-page/blog-page/blog-page.component';
import { BlogContentComponent } from './main-page/blog-page/blog-content/blog-content.component';
import { CommentComponent } from './main-page/blog-page/blog-content/comment/comment.component';
import { ReplyComponent } from './main-page/blog-page/blog-content/comment/reply/reply.component';
import { NewBlogComponent } from './main-page/blog-page/new-blog/new-blog.component';
import { BlogCardComponent } from './main-page/blogs/blog-card/blog-card.component';
import { BlogSmallCardComponent } from './main-page/home/recent-posts/blog-small-card/blog-small-card.component';
import { MostCommentedComponent } from './main-page/home/most-commented/most-commented.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    UsersComponent,
    ResetPasswordComponent,
    PageNotFoundComponent,
    FooterComponent,
    CarouselComponent,
    RecentPostsComponent,
    MainPageComponent,
    InboxComponent,
    BlogsComponent,
    BlogPageComponent,
    BlogContentComponent,
    CommentComponent,
    ReplyComponent,
    NewBlogComponent,
    BlogCardComponent,
    BlogSmallCardComponent,
    MostCommentedComponent
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
