import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

function ageRangeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const birthDate = new Date(control.value);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 6 || age > 130) {
    return { ageRange: true };
  }

  return null;
}

@Component({
  selector: 'app-profile',
  imports: [Navbar, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, ageRangeValidator]],
    });
  }

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: user.birthDate ? user.birthDate.substring(0, 10) : '',
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching profile:', err),
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const { password, confirmPassword } = this.profileForm.value;

    if (password && password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.successMessage = 'Profile updated successfully!';
        this.authService.saveUser(response.user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.successMessage = '';
        this.cdr.detectChanges();
      },
    });
  }
}
