import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {GardenComponent} from './garden/garden.component';
import {
  ButtonModule,
  CalendarModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  MenubarModule,
  MenuModule,
  MessageService,
  MessagesModule,
  SliderModule,
  ToastModule
} from 'primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ErrorComponent} from './error/error.component';
import {RegistrationComponent} from './registration/registration.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MenuComponent} from './menu/menu.component';
import {CreateGardenComponent} from './create-garden/create-garden.component';
import {GardenerComponent} from './gardener/gardener.component';

@NgModule({
  declarations: [
    AppComponent,
    GardenComponent,
    LoginComponent,
    ErrorComponent,
    RegistrationComponent,
    MenuComponent,
    CreateGardenComponent,
    GardenerComponent
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
    HttpClientModule,
    MenuModule,
    MenubarModule,
    DropdownModule,
    MessagesModule,
    ToastModule,
    SliderModule,
    InputTextModule
  ],
  providers: [MenuComponent, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
