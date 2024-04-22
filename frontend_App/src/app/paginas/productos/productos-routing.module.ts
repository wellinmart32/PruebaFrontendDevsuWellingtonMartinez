import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos.component';
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';

const routes: Routes = [
  {
    path: '',
    component: ProductosComponent
  },
  {
    path: 'crear-editar',
    component: CrearEditarProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
