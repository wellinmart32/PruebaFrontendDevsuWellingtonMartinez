import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { FiltroBusquedaPipe } from '../../compartidos/personalizado/filtro-busqueda.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductosComponent,
    FiltroBusquedaPipe
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    FontAwesomeModule,
    FormsModule
  ]
})
export class ProductosModule { }
