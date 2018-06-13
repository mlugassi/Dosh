import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main-page/home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  {path: '', canActivate: [AuthGuard],component: HomeComponent },
   {path: 'login', component: LoginComponent },
   {path: 'resetPassword/:id', component: ResetPasswordComponent},
//   {path: 'cars', component: CarsComponent},
//   {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }