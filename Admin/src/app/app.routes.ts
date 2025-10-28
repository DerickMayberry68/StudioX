import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { ErrorPage } from './pages/error/error';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage, data: { title: 'Home' } },
  { path: '**', component: ErrorPage, data: { title: '404 Error' } }
]; 