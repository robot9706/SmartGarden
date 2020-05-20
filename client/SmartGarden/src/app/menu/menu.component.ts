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
    this.user = !!sessionStorage.getItem('username');
    console.log(this.user);
    this.data.currentMessage.subscribe(message => {
      if (message === 'true') {
        this.user = true;
      }
      console.log(this.user);
    });
  }

  logout() {
    this.loginService.logout().subscribe(
      () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
        this.user = false;
      }
    );
  }
}
