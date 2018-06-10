import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// import { HomeComponent } from './home/home.component';
// import { CarsComponent } from './cars/cars.component';
// import { CarComponent } from './cars/car/car.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
   {path: '', component: DefaultComponent },
   {path: 'home', component: HomeComponent },
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