import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main-page/home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { RecentPostsComponent } from './home/recent-posts/recent-posts.component';

const appRoutes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: "", component: CarouselComponent },
      { path: "users", component: UsersComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: 'resetPassword/:id', component: ResetPasswordComponent },
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