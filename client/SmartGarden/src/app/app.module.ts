import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {GardenComponent} from './garden/garden.component';
import {GardenService} from './garden/garden.service';
import {ButtonModule, CalendarModule, DialogModule} from 'primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ErrorComponent} from './error/error.component';
import {RegistrationComponent} from './registration/registration.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GardenComponent,
    LoginComponent,
    ErrorComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    DialogModule,
    BrowserAnimationsModule,
    ButtonModule,
    CalendarModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [GardenService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
