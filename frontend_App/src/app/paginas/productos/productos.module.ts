import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltroBusquedaPipe } from '../../compartidos/personalizado/filtro-busqueda.pipe';


@NgModule({
  declarations: [
    ProductosComponent,
    FiltroBusquedaPipe
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class ProductosModule { }
