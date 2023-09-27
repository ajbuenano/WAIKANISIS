import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SidenavComponent } from 'src/app/shared/sidenav/sidenav.component';
import { ConfigComponent } from './config/config.component';
import { ProductoComponent } from './producto/producto.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { MotivosComponent } from './motivos/motivos.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { InventarioComponent } from './inventario/inventario.component';
import { HistoricoComponent } from './historico/historico.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; 
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { BodegaComponent } from './bodega/bodega.component';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RestauranteComponent } from './restaurante/restaurante.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidenavComponent,
    ConfigComponent,
    ProductoComponent,
    CategoriaComponent,
    MotivosComponent,
    UsuarioComponent,
    InventarioComponent,
    HistoricoComponent,
    BodegaComponent,
    RestauranteComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    MessagesModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    DropdownModule,
    PickListModule,
    SelectButtonModule
  ]
})
export class HomeModule { }
