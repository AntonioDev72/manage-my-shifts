import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: any;

  constructor(private authService: Auth, private router: Router) {
    this.user = this.authService.getUser();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}