import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Shift } from '../../services/shift';

@Component({
  selector: 'app-add-shift',
  imports: [Navbar, ReactiveFormsModule],
  templateUrl: './add-shift.html',
  styleUrl: './add-shift.css',
})
export class AddShift implements OnInit {
  shiftForm: FormGroup;
  workplaces: string[] = [];
  isEditMode = false;
  editingSlug: string | null = null;
  errorMessage = '';
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private shiftService: Shift,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.shiftForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      hourlyWage: ['', [Validators.required, Validators.min(0)]],
      workplace: ['', Validators.required],
      newWorkplace: [''],
      slug: ['', Validators.required],
      comments: [''],
    });
  }

  ngOnInit() {
    this.editingSlug = this.route.snapshot.queryParamMap.get('slug');
    this.isEditMode = !!this.editingSlug;

    this.shiftService.getShifts().subscribe({
      next: (shifts) => {
        this.workplaces = [...new Set(shifts.map((s) => s.workplace))];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching shifts:', err),
    });

    if (this.isEditMode && this.editingSlug) {
      this.shiftService.getShiftBySlug(this.editingSlug).subscribe({
        next: (shift) => {
          this.shiftForm.patchValue({
            date: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
            hourlyWage: shift.hourlyWage,
            workplace: shift.workplace,
            slug: shift.slug,
            comments: shift.comments,
          });
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching shift:', err),
      });
    }
  }

  onWorkplaceChange() {
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.shiftForm.invalid) {
      return;
    }

    const formValue = this.shiftForm.value;
    let workplace = formValue.workplace;

    if (workplace === '__new__') {
      workplace = formValue.newWorkplace;
      if (!workplace) {
        this.errorMessage = 'Please enter a workplace name.';
        return;
      }
    }

    const shiftData = {
      date: formValue.date,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      hourlyWage: formValue.hourlyWage,
      workplace,
      slug: formValue.slug,
      comments: formValue.comments,
    };

    this.errorMessage = '';
    this.isSaving = true;

    const request = this.isEditMode
      ? this.shiftService.updateShift(this.editingSlug!, shiftData)
      : this.shiftService.addShift(shiftData);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/my-shifts']);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.cdr.detectChanges();
      },
    });
  }
}
