import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { usersGuard } from '../../guard/users.guard';
import { ProductoComponent } from './producto/producto.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { MotivosComponent } from './motivos/motivos.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [usersGuard],
  children:[
    { path: 'home/producto', component: ProductoComponent},
    { path: 'home/categoria', component: CategoriaComponent},
    { path: 'home/motivo', component: MotivosComponent},
  ]},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
