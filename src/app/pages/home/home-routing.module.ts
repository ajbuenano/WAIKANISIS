import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { usersGuard } from '../../guard/users.guard';
import { ProductoComponent } from './producto/producto.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { MotivosComponent } from './motivos/motivos.component';
import { BodegaComponent } from './bodega/bodega.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [usersGuard],
  children:[
    { path: 'producto', component: ProductoComponent},
    { path: 'categoria', component: CategoriaComponent},
    { path: 'motivo', component: MotivosComponent},
    { path: 'usuario', component: UsuarioComponent},
    { path: 'bodega', component: BodegaComponent}
  ]},  
  { path: '**', redirectTo: '', pathMatch: 'full', canActivate: [usersGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
