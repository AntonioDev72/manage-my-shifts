import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Shift } from '../../services/shift';

@Component({
  selector: 'app-my-shifts',
  imports: [Navbar, ReactiveFormsModule],
  templateUrl: './my-shifts.html',
  styleUrl: './my-shifts.css',
})
export class MyShifts implements OnInit {
  shifts: any[] = [];
  filteredShifts: any[] = [];
  filterForm: FormGroup;

  constructor(
    private shiftService: Shift,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      workplace: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.shiftService.getShifts().subscribe({
      next: (shifts) => {
        this.shifts = shifts;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching shifts:', err);
      },
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const { workplace, startDate, endDate } = this.filterForm.value;

    this.filteredShifts = this.shifts.filter((shift) => {
      const matchesWorkplace = !workplace || shift.workplace.toLowerCase().includes(workplace.toLowerCase());
      const matchesStart = !startDate || shift.date >= startDate;
      const matchesEnd = !endDate || shift.date <= endDate;
      return matchesWorkplace && matchesStart && matchesEnd;
    });

    this.cdr.detectChanges();
  }

  onRowClick(shift: any) {
    this.router.navigate(['/add-shift'], { queryParams: { id: shift._id } });
  }
}