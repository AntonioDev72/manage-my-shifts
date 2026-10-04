import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { MyShifts } from './pages/my-shifts/my-shifts';
import { AddShift } from './pages/add-shift/add-shift';
import { Profile } from './pages/profile/profile';
import { AdminHome } from './pages/admin-home/admin-home';
import { AllShifts } from './pages/all-shifts/all-shifts';
import { AllWorkers } from './pages/all-workers/all-workers';
import { WorkerProfile } from './pages/worker-profile/worker-profile';
import { WorkerShifts } from './pages/worker-shifts/worker-shifts';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'home', component: Home },
    { path: 'my-shifts', component: MyShifts },
    { path: 'add-shift', component: AddShift },
    { path: 'profile', component: Profile },
    { path: 'admin/home', component: AdminHome },
    { path: 'admin/shifts', component: AllShifts },
    { path: 'admin/workers', component: AllWorkers },
    { path: 'admin/workers/edit', component: WorkerProfile },
    { path: 'admin/worker-shifts', component: WorkerShifts },
];
