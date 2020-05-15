import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private loginService: LoginService) {
  }

  ngOnInit(): void {
  }

  onClickLogin() {
    this.loginService.login(this.username, this.password).subscribe(
      data => console.log(data),
      error => console.log(error));
  }

}
