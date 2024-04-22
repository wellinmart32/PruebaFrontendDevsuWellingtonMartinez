import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {
  private codigoProducto = new BehaviorSubject<any>(null);
  productoActual = this.codigoProducto.asObservable();

  actualizarProducto(producto: any) {
    this.codigoProducto.next(producto);
  }

  constructor() { }
}
