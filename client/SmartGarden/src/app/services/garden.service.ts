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

  // tslint:disable-next-line:variable-name
  getGarden(garden_id: string): Observable<any> {
    const httpOptions = {
      params: {garden_id},
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get('http://localhost:3000/data/garden_info', httpOptions) as Observable<any>;
  }

  // tslint:disable-next-line:variable-name
  getCellInfo(cell_index, garden_id): Observable<any> {
    const httpOptions = {
      params: {garden_id, cell_index},
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get('http://localhost:3000/data/garden_cell_info', httpOptions) as Observable<any>;
  }

  // tslint:disable-next-line:variable-name
  requestPlant(cell_index: any, garden_id: any, content: any) {
    // tslint:disable-next-line:variable-name
    const action_data = {new_plant: content};
    const action = 'ACTION_REQUEST_PLANT_CHANGE';
    return this.http.post('http://localhost:3000/data/garden_cell_action', {
      garden_id, cell_index, action,
      action_data
    }, this.httpOptions) as Observable<any>;
  }

  // tslint:disable-next-line:variable-name
  confirmPlant(cell_index: any, garden_id: any, content: any) {
    // tslint:disable-next-line:variable-name
    const action_data = {content_requested: content};
    const action = 'ACTION_CONFIRM_PLANT_CHANGE';
    return this.http.post('http://localhost:3000/data/garden_cell_action', {
      garden_id, cell_index, action,
      action_data
    }, this.httpOptions) as Observable<any>;
  }

  gardenControl(garden: any, heating: any, watering: any) {
    return this.http.post('http://localhost:3000/data/garden_control', {garden, heating, watering}, this.httpOptions) as Observable<any>;
  }
}
