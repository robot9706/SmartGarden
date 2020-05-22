import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {GardenComponent} from './garden/garden.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {ErrorComponent} from './error/error.component';
import {AuthGuardService} from './services/auth-guard.service';
import {CreateGardenComponent} from './create-garden/create-garden.component';
import {GardenerComponent} from './gardener/gardener.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'garden', component: GardenComponent, canActivate: [AuthGuardService]},
  {path: 'create', component: CreateGardenComponent, canActivate: [AuthGuardService]},
  {path: 'gardener', component: GardenerComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})

export class AppRoutingModule {
}
