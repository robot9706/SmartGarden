import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';
import {DataService} from '../services/data.service';
import {MessageService} from 'primeng';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private loginService: LoginService,
              private router: Router,
              private data: DataService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  onClickLogin() {
    this.loginService.login(this.username, this.password).subscribe(
      () => {
        sessionStorage.setItem('username', this.username);
        this.router.navigate(['/garden']);
        this.data.changeMessage('true');
      },
      () => {
        this.showError();
      });
  }

  private showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Belépés sikertelen',
      detail: 'Valamilyen hiba lépett fel, vagy a formátum nem megfelelő'
    });
  }

}
