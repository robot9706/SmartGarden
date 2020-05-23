import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    const httpOptions = {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://localhost:3000/data/login', {username, password}, httpOptions);
  }

  logout(): Observable<any> {
    const httpOptions = {
      withCredentials: true
    };
    return this.http.get('http://localhost:3000/data/logout', httpOptions);
  }
}
