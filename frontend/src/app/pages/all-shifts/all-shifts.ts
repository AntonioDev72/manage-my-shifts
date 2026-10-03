import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminNavbar } from '../../components/admin-navbar/admin-navbar';
import { Shift } from '../../services/shift';

@Component({
  selector: 'app-all-shifts',
  imports: [AdminNavbar, ReactiveFormsModule],
  templateUrl: './all-shifts.html',
  styleUrl: './all-shifts.css',
})
export class AllShifts implements OnInit {
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
      workerName: [''],
      workplace: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.shiftService.getAllShifts().subscribe({
      next: (shifts) => {
        this.shifts = shifts;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching shifts:', err),
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const { workerName, workplace, startDate, endDate } = this.filterForm.value;

    this.filteredShifts = this.shifts.filter((shift) => {
      const fullName = shift.worker ? `${shift.worker.firstName} ${shift.worker.lastName}` : '';
      const matchesWorker = !workerName || fullName.toLowerCase().includes(workerName.toLowerCase());
      const matchesWorkplace = !workplace || shift.workplace.toLowerCase().includes(workplace.toLowerCase());
      const matchesStart = !startDate || shift.date >= startDate;
      const matchesEnd = !endDate || shift.date <= endDate;
      return matchesWorker && matchesWorkplace && matchesStart && matchesEnd;
    });

    this.cdr.detectChanges();
  }

  onRowClick(shift: any) {
    this.router.navigate(['/add-shift'], { queryParams: { slug: shift.slug } });
  }
}
