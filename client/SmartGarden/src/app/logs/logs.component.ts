import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng';
import {GardenService} from '../services/garden.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  gardens;
  gardenOptions: SelectItem[];
  selectedGarden;
  isLogsVisible = true;
  logs;

  constructor(private gardenService: GardenService) {
  }

  ngOnInit(): void {
    this.getGardens();
  }

  private getGardens() {
    this.gardenService.getAllGarden().subscribe(
      garden => {
        this.gardens = garden.data;
        const nonEmptyGardenOptions = garden.data.own.map(data => ({
          label: data.name,
          value: data._id
        } as SelectItem));
        this.gardenOptions = [...nonEmptyGardenOptions];
        if (_.find(nonEmptyGardenOptions)) {
          this.fetchLogsById(_.find(nonEmptyGardenOptions).value);
        } else {
          this.isLogsVisible = false;
        }
      }
    );
  }

  private fetchLogsById(gardenId: string) {
    this.gardenService.getLogs(gardenId).subscribe(logs => {
      this.logs = logs.data;
    });
  }

  getValue(selectedGarden: any) {
    this.fetchLogsById(selectedGarden);
  }

  getMoment(date: string) {
    return moment(date).format('LLL');
  }
}
