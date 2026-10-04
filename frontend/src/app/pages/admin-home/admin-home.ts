import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminNavbar } from '../../components/admin-navbar/admin-navbar';
import { Shift } from '../../services/shift';

@Component({
  selector: 'app-admin-home',
  imports: [AdminNavbar, DatePipe, CurrencyPipe],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome implements OnInit {
  shifts: any[] = [];
  workerOfMonth: { name: string; count: number } | null = null;
  thisWeekShifts: any[] = [];
  highestEarningMonth: { month: string; total: number } | null = null;

  constructor(private shiftService: Shift, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.shiftService.getAllShifts().subscribe({
      next: (shifts) => {
        this.shifts = shifts;
        this.calculateWorkerOfMonth();
        this.calculateThisWeekShifts();
        this.calculateHighestEarningMonth();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching shifts:', err),
    });
  }

  calculateWorkerOfMonth() {
    const counts: { [key: string]: { name: string; count: number } } = {};

    this.shifts.forEach((s) => {
      if (!s.worker) {
        return;
      }
      const id = s.worker._id;
      const name = `${s.worker.firstName} ${s.worker.lastName}`;

      if (!counts[id]) {
        counts[id] = { name, count: 0 };
      }
      counts[id].count++;
    });

    let best: { name: string; count: number } | null = null;
    for (const id in counts) {
      if (!best || counts[id].count > best.count) {
        best = counts[id];
      }
    }

    this.workerOfMonth = best;
  }

  calculateThisWeekShifts() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    this.thisWeekShifts = this.shifts.filter((s) => {
      const shiftDate = new Date(s.date);
      return shiftDate >= startOfWeek && shiftDate < today;
    });
  }

  calculateHighestEarningMonth() {
    const totalsByMonth: { [key: string]: number } = {};

    this.shifts.forEach((s) => {
      const monthKey = s.date.substring(0, 7);
      totalsByMonth[monthKey] = (totalsByMonth[monthKey] || 0) + s.totalEarning;
    });

    let bestMonth: string | null = null;
    let bestTotal = 0;

    for (const month in totalsByMonth) {
      if (totalsByMonth[month] > bestTotal) {
        bestMonth = month;
        bestTotal = totalsByMonth[month];
      }
    }

    this.highestEarningMonth = bestMonth ? { month: bestMonth, total: bestTotal } : null;
  }
}
