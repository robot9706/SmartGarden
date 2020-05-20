import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GardenService {

  constructor(private http: HttpClient) {
  }

  httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getAllGarden(): Observable<any> {
    return this.http.get('http://localhost:3000/data/garden_all', this.httpOptions) as Observable<any>;
  }

  create(name: string): Observable<any> {
    return this.http.post('http://localhost:3000/data/garden_create', {name}, this.httpOptions) as Observable<any>;
  }
}
