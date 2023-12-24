import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { usersGuard } from './guard/users.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [usersGuard], data: { roles: ['admin', 'bodega', 'restaurante'] }},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [usersGuard], data: { roles: ['admin', 'bodega', 'restaurante'] }},
  { path: '**', redirectTo: 'home', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
