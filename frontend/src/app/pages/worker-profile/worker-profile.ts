import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminNavbar } from '../../components/admin-navbar/admin-navbar';
import { Auth } from '../../services/auth';

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
  selector: 'app-worker-profile',
  imports: [AdminNavbar, ReactiveFormsModule],
  templateUrl: './worker-profile.html',
  styleUrl: './worker-profile.css',
})
export class WorkerProfile implements OnInit {
  workerForm: FormGroup;
  workerId = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.workerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, ageRangeValidator]],
    });
  }

  ngOnInit() {
    this.workerId = this.route.snapshot.queryParamMap.get('id') || '';

    this.authService.getWorkerById(this.workerId).subscribe({
      next: (worker) => {
        this.workerForm.patchValue({
          email: worker.email,
          firstName: worker.firstName,
          lastName: worker.lastName,
          birthDate: worker.birthDate ? worker.birthDate.substring(0, 10) : '',
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching worker:', err),
    });
  }

  onSubmit() {
    if (this.workerForm.invalid) {
      this.workerForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const { password, confirmPassword } = this.workerForm.value;

    if (password && password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.updateWorker(this.workerId, this.workerForm.value).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Worker updated successfully!';
        this.router.navigate(['/admin/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.successMessage = '';
        this.cdr.detectChanges();
      },
    });
  }

  onFilterShifts() {
    this.router.navigate(['/admin/worker-shifts'], { queryParams: { id: this.workerId } });
  }

  onDelete() {
    const confirmed = confirm('Are you sure you want to delete this worker? This will also delete all their shifts.');
    if (!confirmed) {
      return;
    }

    this.authService.deleteWorker(this.workerId).subscribe({
      next: () => {
        this.router.navigate(['/admin/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not delete worker';
        this.cdr.detectChanges();
      },
    });
  }
}
