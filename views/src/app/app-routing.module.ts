import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { HomeComponent } from './main-page/home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { UsersComponent } from './main-page/users/users.component';
import { InboxComponent } from './main-page/inbox/inbox.component';
import { BlogsComponent } from './main-page/blogs/blogs.component';
import { BlogPageComponent } from './main-page/blog-page/blog-page.component';
import { BlogContentComponent } from './main-page/blog-page/blog-content/blog-content.component';
import { NewBlogComponent } from './main-page/blog-page/new-blog/new-blog.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
  { path: 'resetPassword/:id', component: ResetPasswordComponent },
  { path: 'contactUS', component: ContactComponent },
  { path: 'aboutUS', component: AboutComponent },
  { path: '', component: MainPageComponent, canActivate: [AuthGuard], children: [
      { path: "", component: HomeComponent },
      { path: 'blogs', component: BlogsComponent },
      {
        path: 'blogs', component: BlogPageComponent, children: [
          { path: 'blog', component: NewBlogComponent },
          { path: ':id', component: BlogContentComponent }
        ]
      },
      { path: 'blogs/filter/:filter', component: BlogsComponent },
      { path: "users", component: UsersComponent },
      { path: "inbox", component: InboxComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  //   {path: 'cars', component: CarsComponent},
  //   {path: 'not-found', component: PageNotFoundComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }