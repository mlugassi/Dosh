import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { NavbarComponent } from './navbar/navbar.component';

// import { HomeComponent } from './home/home.component';
// import { CarsComponent } from './cars/cars.component';
// import { CarComponent } from './cars/car/car.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
   {path: '', component: DefaultComponent },
   {path: 'navbar', component: NavbarComponent },
//   {path: 'cars', component: CarsComponent},
//   {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }