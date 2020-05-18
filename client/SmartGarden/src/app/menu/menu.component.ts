import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: boolean;

  constructor(private loginService: LoginService,
              private router: Router,
              private data: DataService) {
  }

  ngOnInit(): void {
    this.user = !!localStorage.getItem('username');
    this.data.currentMessage.subscribe(message => this.user = message);
  }

  logout() {
    this.loginService.logout().subscribe(
      data => {
        localStorage.clear();
        console.log(data);
        this.router.navigate(['/login']);
        this.user = false;
      },
      error => {
        console.log(error);
      }
    );
  }
}
