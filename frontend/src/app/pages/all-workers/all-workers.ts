import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AdminNavbar } from '../../components/admin-navbar/admin-navbar';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-all-workers',
  imports: [AdminNavbar, DatePipe],
  templateUrl: './all-workers.html',
  styleUrl: './all-workers.css',
})
export class AllWorkers implements OnInit {
  workers: any[] = [];

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.getAllWorkers().subscribe({
      next: (workers) => {
        this.workers = workers;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching workers:', err),
    });
  }

  onRowClick(worker: any) {
    this.router.navigate(['/admin/workers/edit'], { queryParams: { id: worker._id } });
  }
}
