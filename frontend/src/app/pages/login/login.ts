import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.errorMessage = '';
        this.authService.saveToken(response.token);
        this.authService.saveUser(response.user);

        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
      },
    });
  }
}