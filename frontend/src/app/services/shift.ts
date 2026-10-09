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

  getAllShifts() {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getWorkerShifts(workerId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/worker/${workerId}`);
  }

  getShiftById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addShift(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateShift(id: string, data: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteShift(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
