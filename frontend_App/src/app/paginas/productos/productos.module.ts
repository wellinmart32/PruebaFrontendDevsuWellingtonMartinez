import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltroBusquedaPipe } from '../../compartidos/personalizado/filtro-busqueda.pipe';
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';
import { PersonalizadoModule } from '../../compartidos/personalizado/personalizado.module';


@NgModule({
  declarations: [
    ProductosComponent,
    FiltroBusquedaPipe,
    CrearEditarProductoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PersonalizadoModule
  ]
})
export class ProductosModule { }
