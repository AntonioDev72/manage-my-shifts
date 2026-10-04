import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminNavbar } from '../../components/admin-navbar/admin-navbar';
import { Shift } from '../../services/shift';

@Component({
  selector: 'app-worker-shifts',
  imports: [AdminNavbar, ReactiveFormsModule],
  templateUrl: './worker-shifts.html',
  styleUrl: './worker-shifts.css',
})
export class WorkerShifts implements OnInit {
  shifts: any[] = [];
  filteredShifts: any[] = [];
  filterForm: FormGroup;
  workerId = '';

  constructor(
    private shiftService: Shift,
    private route: ActivatedRoute,
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
    this.workerId = this.route.snapshot.queryParamMap.get('id') || '';

    this.shiftService.getWorkerShifts(this.workerId).subscribe({
      next: (shifts) => {
        this.shifts = shifts;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching worker shifts:', err),
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
}
