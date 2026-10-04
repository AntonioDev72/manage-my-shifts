import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Shift } from '../../services/shift';

@Component({
  selector: 'app-home',
  imports: [Navbar, DatePipe, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  shifts: any[] = [];
  upcomingShift: any = null;
  thisWeekShifts: any[] = [];
  highestEarningMonth: { month: string; total: number } | null = null;

  constructor(private shiftService: Shift, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.shiftService.getShifts().subscribe({
      next: (shifts) => {
        this.shifts = shifts;
        this.calculateUpcomingShift();
        this.calculateThisWeekShifts();
        this.calculateHighestEarningMonth();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching shifts:', err);
      },
    });
  }

  calculateUpcomingShift() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureShifts = this.shifts
      .filter((s) => new Date(s.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.upcomingShift = futureShifts.length > 0 ? futureShifts[0] : null;
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
      const monthKey = s.date.substring(0, 7); // "YYYY-MM"
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