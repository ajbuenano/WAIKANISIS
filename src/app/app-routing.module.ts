import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { usersGuard } from './guard/users.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [usersGuard]},
  { path: 'pages/login', redirectTo: 'login', pathMatch: 'full'},
  { path: 'pages/home', component: LoginComponent, canActivate: [usersGuard]},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [usersGuard]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
