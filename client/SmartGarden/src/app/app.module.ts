import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {GardenComponent} from './garden/garden.component';
import {GardenService} from './garden/garden.service';

@NgModule({
  declarations: [
    AppComponent,
    GardenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GardenService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
