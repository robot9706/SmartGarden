import {Injectable} from '@angular/core';
import {Garden} from '../models/garden.model';

@Injectable({
    providedIn: 'root'
  }
)
export class GardenService {
  constructor() {
  }

  getGarden() {
    const garden: Garden[] = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < 25; i++) {
      garden[i] = new Garden();
      garden[i].x = x;
      garden[i].y = y;
      garden[i].index = i;
      garden[i].background = 'plant_bg';
      garden[i].vegetable = 'plant_carrot';
      if ((i + 1) % 5 === 0) {
        y += 100;
        x = 0;
      } else {
        x += 100;
      }
    }
    console.log(garden);
    return garden;
  }
}
