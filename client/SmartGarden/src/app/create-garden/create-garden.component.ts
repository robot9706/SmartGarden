import {Component, OnInit} from '@angular/core';
import {GardenService} from '../services/garden.service';
import {MessageService} from 'primeng';

@Component({
  selector: 'app-create-garden',
  templateUrl: './create-garden.component.html',
  styleUrls: ['./create-garden.component.css']
})
export class CreateGardenComponent implements OnInit {

  name: string;

  constructor(private gardenService: GardenService, private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  onClickCreate() {
    this.gardenService.create(this.name).subscribe(
      () => {
        this.showSuccess();
      },
      () => {
        this.showError();
      });
  }

  private showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Mentés sikeres', detail: 'A kertet sikeresen létrehoztad'});
  }

  private showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Mentés sikertelen',
      detail: 'Valamilyen hiba lépett fel, vagy a formátum nem megfelelő'
    });
  }

}
