import {Component, OnInit} from '@angular/core';
import {MessageService, SelectItem} from 'primeng';
import {GardenService} from '../services/garden.service';
import {GardenerService} from '../services/gardener.service';
import * as _ from 'lodash';

const EMPTY_OPTION = {
  label: '',
  value: ''
} as SelectItem;

@Component({
  selector: 'app-gardener',
  templateUrl: './gardener.component.html',
  styleUrls: ['./gardener.component.css']
})
export class GardenerComponent implements OnInit {

  gardens;
  gardenOptions;
  selectedGardenId;
  selectedGardenId2;
  username;
  isFieldVisible = true;
  userId;
  gardenersOtions: SelectItem[] = [];

  constructor(private gardenService: GardenService,
              private gardenerService: GardenerService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getGardens();
  }

  getGardenValue(selectedGardenId: any) {
    this.gardenService.getGarden(selectedGardenId).subscribe(
      gardenInfos => {
        this.getGardeners(gardenInfos);
      },
      error => {
        console.log(error);
      }
    );
  }


  onClickAdd(dropdown) {
    dropdown.updateSelectedOption(null);
    this.gardenerService.addGardener(this.selectedGardenId, this.username).subscribe(
      data => {
        data.ok === true ? this.showSuccess() : this.showError();
      });
  }

  onClickRemove(dropdown2, dropdown3) {
    dropdown2.updateSelectedOption(null);
    dropdown3.updateSelectedOption(null);
    this.gardenerService.removeGardener(this.selectedGardenId2, this.userId).subscribe(
      data => {
        console.log(data);
        data.ok === true ? this.showSuccess() : this.showError();
      });
  }

  private getGardeners(gardenInfos) {
    const arr1: SelectItem[] = [];
    if (gardenInfos.data === undefined) {
      arr1.push(EMPTY_OPTION);
      this.gardenersOtions = arr1;
    } else {
      arr1.push(EMPTY_OPTION);
      gardenInfos.data.gardeners.forEach(g => {
        arr1.push({label: g.gardenerUsername, value: g.gardenerID} as SelectItem);
      });
      this.gardenersOtions = arr1;
    }
  }

  private getGardens() {
    this.gardenService.getAllGarden().subscribe(
      garden => {
        this.gardens = garden.data;
        const nonEmptyGardenOptions = garden.data.own.map(data => ({
          label: data.name,
          value: data._id
        } as SelectItem));
        this.gardenOptions = [EMPTY_OPTION, ...nonEmptyGardenOptions];
        this.isFieldVisible = !!_.find(nonEmptyGardenOptions);
      }
    );
  }

  private showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Mentés sikeres', detail: 'Az semény sikeresen végrehajtva.'});
    /*this.gardenersOtions = [];
    this.gardenOptions = [];*/
    /*this.getGardens();*/
  }

  private showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Mentés sikertelen',
      detail: 'Helytelen vagy hiányzó adat.'
    });
  }
}
