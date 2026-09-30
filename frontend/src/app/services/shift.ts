import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Shift {
  private apiUrl = 'http://localhost:3000/api/shifts';

  constructor(private http: HttpClient) {}

  getShifts() {
    return this.http.get<any[]>(this.apiUrl);
  }
}