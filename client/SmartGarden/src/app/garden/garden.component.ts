import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {GardenService} from '../services/garden.service';
import {MessageService, SelectItem} from 'primeng';
import {CellCoordinate} from '../models/garden.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.css']
})
export class GardenComponent implements OnInit {
  gardens;
  gardenOptions: SelectItem[] = [];
  selectedGardenId;
  garden;
  cellCoordinate: CellCoordinate[] = [];
  isCanvasVisible = true;
  display = false;
  index;
  content;
  humidity;
  temperature;
  request;
  plantOptions: SelectItem[];
  isOwnCell = true;
  selectedCellGardenId;
  originalContent;
  gardenHeating;
  gardenWatering;
  waterOptions: SelectItem[];
  heatOptions: SelectItem[];
  plantInfo = false;
  plantName;
  plantRequiredHumidity = [];
  plantRequiredTemperature = [];
  plantWaterPerDay;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private gardenService: GardenService,
              private router: Router,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getGardens();
    this.initPlantDropdownValues();
    this.initHeatingOptions();
    this.initWateringOptions();
  }

  private initPlantDropdownValues() {
    this.plantOptions = [
      {label: 'Üres ültetés', value: 'PLANT_EMPTY'},
      {label: 'Almafa ültetés', value: 'PLANT_APPLE'},
      {label: 'Répa ületetés', value: 'PLANT_CARROT'},
      {label: 'Krumpli ültetés', value: 'PLANT_POTATO'},
      {label: 'Retek ültetés', value: 'PLANT_RADDISH'},
      {label: 'Cukornád ültetés', value: 'PLANT_SUGAR_CANE'},
      {label: 'Búza ültetés', value: 'PLANT_WHEAT'},
    ];
  }

  private initWateringOptions() {
    this.waterOptions = [
      {label: 'Öntözés bekapcsolva', value: 1},
      {label: 'Öntözés kikapcsolva', value: 0},
    ];
  }

  private initHeatingOptions() {
    this.heatOptions = [
      {label: 'Fűtés bekapcsolva', value: 1},
      {label: 'Fűtés/hűtés kikapcsolva', value: 0},
      {label: 'Hűtés bekapcsolva', value: -1}
    ];
  }

  onClickCanvas(event: any) {
    // https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
    const elem = document.getElementById('canvas');
    const left = event.pageX - elem.offsetLeft + elem.clientLeft;
    const top = event.pageY - elem.offsetTop + elem.clientTop;
    const cell = _.find(this.cellCoordinate, c => c.x === left - (left % 100) && c.y === top - (top % 100));
    this.getCellInfos(cell.index, cell.gardenId, cell.isOwn);
  }

  onClickCreateGarden() {
    this.router.navigate(['/create']);
  }

  private getCellInfos(index: number, gardenId: string, isOwn: boolean) {
    this.gardenService.getCellInfo(index, gardenId).subscribe(
      data => {
        this.index = data.data.cell.index;
        this.content = data.data.cell.content;
        this.humidity = data.data.cell.humidity;
        this.temperature = data.data.cell.temperature;
        this.request = data.data.cell.content_requested;
      },
      () => {
      },
      () => {
        this.display = true;
        this.isOwnCell = isOwn;
        this.selectedCellGardenId = gardenId;
        this.originalContent = this.content;
      }
    );
  }

  private createPicture(x: number, y: number, cell) {
    let content: string;
    if (cell.content === 'EMPTY') {
      content = 'empty';
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, x, y, 100, 100);
        this.ctx.strokeRect(x, y, 100, 100);
      };
      img.src = 'assets/plants/' + content + '.png';

      if (cell.content_requested != null) {
        setTimeout(() => {
          const img2 = new Image();
          img2.onload = () => {
            this.ctx.drawImage(img2, x + 25, y + 25, 50, 50);
          };
          img2.src = 'assets/plants/new.png';
        }, 500);
      }
    } else {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, x, y, 100, 100);
        this.ctx.strokeRect(x, y, 100, 100);
      };
      img.src = 'assets/plants/' + 'plant_bg' + '.png';


      setTimeout(() => {
        const img2 = new Image();
        img2.onload = () => {
          this.ctx.drawImage(img2, x + 25, y + 25, 50, 50);
        };
        img2.src = 'assets/plants/' + cell.content.toLowerCase() + '.png';
      }, 500);

    }
  }

  private getContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  private fillWithPictures(garden, isOwn) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < garden.cells.length; i++) {
      this.createPicture(x, y, garden.cells[i]);
      this.cellCoordinate[i] = new CellCoordinate();
      this.cellCoordinate[i].x = x;
      this.cellCoordinate[i].y = y;
      this.cellCoordinate[i].index = i;
      this.cellCoordinate[i].isOwn = isOwn;
      this.cellCoordinate[i].gardenId = garden._id;
      if ((i + 1) % 5 === 0) {
        y += 100;
        x = 0;
      } else {
        x += 100;
      }
    }
  }

  getValue(selectedGarden: any) {
    this.fetchGardenById(selectedGarden);
  }

  private fetchGardenById(gardenId: string) {
    this.getContext();
    let isOwn = true;
    this.garden = _.find(this.gardens.own, g => g._id === gardenId);
    if (this.garden === undefined) {
      this.garden = _.find(this.gardens.other, g => g._id === gardenId);
      isOwn = false;
    }
    this.gardenHeating = this.garden.heating;
    this.gardenWatering = this.garden.watering;
    this.fillWithPictures(this.garden, isOwn);
  }

  private getGardens() {
    this.gardenService.getAllGarden().subscribe(
      garden => {
        this.gardens = garden.data;
        const nonEmptyGardenOptions = garden.data.own.map(data => ({
          label: data.name + ' - ' + 'saját kert',
          value: data._id
        } as SelectItem));
        const nonEmptyOtherGardenOptions = garden.data.other.map(data => ({
          label: data.name + ' - ' + 'gondozott kert',
          value: data._id
        } as SelectItem));
        this.gardenOptions = [...nonEmptyGardenOptions, ...nonEmptyOtherGardenOptions];
        if (_.find(nonEmptyGardenOptions)) {
          this.fetchGardenById(this.garden ? this.garden._id : _.find(nonEmptyGardenOptions).value);
        } else if (_.find(nonEmptyOtherGardenOptions)) {
          this.fetchGardenById(this.garden ? this.garden._id : _.find(nonEmptyOtherGardenOptions).value);
        } else {
          this.isCanvasVisible = false;
        }
      }
    );
  }

  onClickSave() {
    if (this.isOwnCell && this.originalContent !== this.content) {
      this.gardenService.requestPlant(this.index, this.selectedCellGardenId, this.content).subscribe(() => {
          this.showSuccess();
          this.display = false;
        },
        () => {
          this.showError();
        },
        () => {
          this.getGardens();
          this.selectedGardenId = this.selectedCellGardenId;
        });
    }
    if (!this.isOwnCell && this.request) {
      this.gardenService.confirmPlant(this.index, this.selectedCellGardenId, this.request).subscribe(() => {
          this.showSuccess();
          this.display = false;
        },
        () => {
          this.showError();
        },
        () => {
          this.getGardens();
          this.selectedGardenId = this.selectedCellGardenId;
        }
      );
    }
    this.display = false;
  }

  getRequetText(request: string) {
    if (request) {
      let text;
      text = _.find(this.plantOptions, p => p.value as string === request);
      return text.label;
    } else {
      return '';
    }
  }

  onClickGardenControl() {
    this.gardenService.gardenControl(this.garden._id, this.gardenHeating, this.gardenWatering).subscribe(
      data => {
        data.ok === true ? this.showSuccess() : this.showError();
        this.getGardens();
        this.selectedGardenId = this.garden._id;
      }
    );
  }

  getPlantInfo(content: any) {
    this.gardenService.getPlantInfo(content).subscribe(plant => {
      if (plant.ok) {
        const plantInfo = _.get(plant.data, content);
        if (plantInfo) {
          this.plantName = plantInfo.name;
          this.plantRequiredHumidity = plantInfo.requiredHumidity;
          this.plantRequiredTemperature = plantInfo.requiredTemperature;
          this.plantWaterPerDay = plantInfo.waterPerDay;
          this.plantInfo = true;
        } else {
          this.showInfo();
        }
      }
    });
  }

  private showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Mentés sikeres', detail: 'A Művelet sikeresen végbement.'});
  }

  private showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Nincs információ',
      detail: 'Az adott növényhez még nem áll rendelkezésre információ.'
    });
  }

  private showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Mentés sikertelen',
      detail: 'Valamilyen hiba lépett fel, vagy a formátum nem megfelelő.'
    });
  }
}
