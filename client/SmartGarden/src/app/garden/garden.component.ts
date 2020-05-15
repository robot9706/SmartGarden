import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {Garden} from '../models/garden.model';
import {GardenService} from './garden.service';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.css']
})
export class GardenComponent implements OnInit {

  garden: Garden[] = [];
  display = false;
  clickedIndex;
  clickedBackground;
  clickedVegetable;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private gardenService: GardenService) {
  }

  ngOnInit(): void {
    this.initGarden();
    this.getContext();
    this.fillWithPictures();
  }

  onClickCanvas(event: any) {
    // https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
    const elem = document.getElementById('canvas');
    const left = event.pageX - elem.offsetLeft + elem.clientLeft;
    const top = event.pageY - elem.offsetTop + elem.clientTop;
    const field = _.find(this.garden, f => f.x === left - (left % 100) && f.y === top - (top % 100));
    this.clickedIndex = field.index;
    this.clickedBackground = field.background;
    this.clickedVegetable = field.vegetable;
    this.display = true;
    console.log(field);
  }

  private createPicture(x: number, y: number, bg: string, vegetable: string) {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, x, y, 100, 100);
      this.ctx.strokeRect(x, y, 100, 100);
    };
    img.src = 'assets/plants/' + bg + '.png';

    if (vegetable) {
      const img2 = new Image();
      img2.onload = () => {
        this.ctx.drawImage(img2, x + 25, y + 25, 50, 50);
      };
      img2.src = 'assets/plants/' + vegetable + '.png';
    }
  }

  private getContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  private fillWithPictures() {
    for (let i = 0; i < 25; i++) {
      this.createPicture(this.garden[i].x, this.garden[i].y, this.garden[i].background, this.garden[i].vegetable);
    }
  }

  private initGarden() {
    this.garden = this.gardenService.getGarden();
  }
}
