import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { QubicViewComponent } from './qubic-view/qubic-view.component';

@NgModule({
  declarations: [
    AppComponent,
    QubicViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
