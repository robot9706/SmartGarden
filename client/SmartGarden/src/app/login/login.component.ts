import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';
import {DataService} from '../services/data.service';

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
              private data: DataService) {
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  onClickLogin() {
    this.loginService.login(this.username, this.password).subscribe(
      data => {
        console.log(data);
        localStorage.setItem('username', this.username);
        this.router.navigate(['/garden']);
        this.data.changeMessage(true);
      },
      error => {
        console.log(error);
      });
  }

}
