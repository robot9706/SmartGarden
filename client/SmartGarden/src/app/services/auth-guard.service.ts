import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends CanActivate {

  constructor() {
  }
}
