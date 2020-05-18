import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/data/login', {username, password}, this.httpOptions);
  }

  logout(): Observable<any> {
    return this.http.get('http://localhost:3000/data/logout', this.httpOptions);
  }
}
