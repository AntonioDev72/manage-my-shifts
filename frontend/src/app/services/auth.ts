import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  login(data: any) {
  return this.http.post(`${this.apiUrl}/login`, data);
  }
  saveToken(token: string) {
  localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

getUser(): any {
  const userJSON = localStorage.getItem('user');
  return userJSON ? JSON.parse(userJSON) : null;
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
