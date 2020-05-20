import {Component, OnInit} from '@angular/core';
import {RegistrationService} from '../services/registration.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  username: string;
  password: string;

  constructor(private registrationService: RegistrationService,
              private router: Router,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  onClickRegistration() {
    this.registrationService.registration(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      () => {
        this.showError();
      });
  }

  private showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Mentés sikertelen',
      detail: 'Valamilyen hiba lépett fel, vagy a formátum nem megfelelő'
    });
  }
}
