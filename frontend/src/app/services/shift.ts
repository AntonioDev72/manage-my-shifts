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

  getShiftBySlug(slug: string) {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  addShift(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateShift(slug: string, data: any) {
    return this.http.put(`${this.apiUrl}/${slug}`, data);
  }
}
