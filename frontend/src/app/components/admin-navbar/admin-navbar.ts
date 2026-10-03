import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  user: any;

  constructor(private authService: Auth, private router: Router) {
    this.user = this.authService.getUser();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
