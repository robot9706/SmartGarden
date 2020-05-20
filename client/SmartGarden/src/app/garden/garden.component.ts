import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {GardenService} from '../services/garden.service';
import {SelectItem} from 'primeng';
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

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private gardenService: GardenService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getGardens();
  }

  onClickCanvas(event: any) {
    // https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
    const elem = document.getElementById('canvas');
    const left = event.pageX - elem.offsetLeft + elem.clientLeft;
    const top = event.pageY - elem.offsetTop + elem.clientTop;
    const cell = _.find(this.cellCoordinate, c => c.x === left - (left % 100) && c.y === top - (top % 100));
    console.log(cell);
  }

  onClickCreateGarden() {
    this.router.navigate(['/create']);
  }

  private createPicture(x: number, y: number, cell) {
    const img = new Image();
    const bg = cell.content === 'EMPTY' ? 'empty' : 'plant_bg';
    img.onload = () => {
      this.ctx.drawImage(img, x, y, 100, 100);
      this.ctx.strokeRect(x, y, 100, 100);
    };
    img.src = 'assets/plants/' + bg + '.png';
  }

  private getContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  private fillWithPictures(garden) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < garden.cells.length; i++) {
      this.createPicture(x, y, garden.cells[i]);
      this.cellCoordinate[i] = new CellCoordinate();
      this.cellCoordinate[i].x = x;
      this.cellCoordinate[i].y = y;
      this.cellCoordinate[i].index = i;
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
    this.garden = _.find(this.gardens.own, g => g._id === gardenId);
    console.log(this.garden);
    this.fillWithPictures(this.garden);
  }

  private getGardens() {
    this.gardenService.getAllGarden().subscribe(
      garden => {
        console.log(garden.data);
        this.gardens = garden.data;
        const nonEmptyGardenOptions = garden.data.own.map(data => ({
          label: data.name,
          value: data._id
        } as SelectItem));
        this.gardenOptions = [...nonEmptyGardenOptions];
        if (_.find(nonEmptyGardenOptions)) {
          this.fetchGardenById(_.find(nonEmptyGardenOptions).value);
        } else {
          this.isCanvasVisible = false;
          console.log('nefussle');
        }
      }
    );
  }
}
