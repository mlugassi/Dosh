import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { HomeComponent } from './main-page/home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent , canActivate: [AuthGuard], children: [
      { path: "", component: HomeComponent },
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