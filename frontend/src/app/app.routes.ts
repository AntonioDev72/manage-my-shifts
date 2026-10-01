import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { MyShifts } from './pages/my-shifts/my-shifts';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'home', component: Home },
    { path: 'my-shifts', component: MyShifts },
];
