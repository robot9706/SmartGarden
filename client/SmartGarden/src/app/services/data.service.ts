import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject('nope');
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }

  changeMessage(message) {
    this.messageSource.next(message);
  }
}
