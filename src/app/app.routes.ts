import { Routes } from '@angular/router';
import { ClientComponent } from './component/client/client.component';

export const routes: Routes = [
  { path: 'client', component: ClientComponent },
  { redirectTo: 'client', path: '', pathMatch: 'full' },
];
