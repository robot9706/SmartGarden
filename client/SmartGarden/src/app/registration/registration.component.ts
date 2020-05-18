import {Component, OnInit} from '@angular/core';
import {RegistrationService} from '../services/registration.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  username: string;
  password: string;

  constructor(private registrationService: RegistrationService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onClickRegistration() {
    this.registrationService.registration(this.username, this.password).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
      });
  }

}
