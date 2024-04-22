import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor() { }

  mostrarMensajeExitoso(mensaje: string): void {
    this.mostrarMensaje('success', 'Éxito', mensaje);
  }

  mostrarMensajeError(mensaje: string): void {
    this.mostrarMensaje('error', 'Error', mensaje);
  }

  mostrarMensajeInformacion(mensaje: string): void {
    this.mostrarMensaje('info', 'Información', mensaje);
  }

  mostrarMensajeConfirmacion(mensaje: string): Promise<boolean> {
    return this.mostrarMensaje('warning', 'Confirmación', mensaje, 'Cancelar', 'Confirmar');
  }

  private async mostrarMensaje(
    icono: SweetAlertIcon,
    titulo: string,
    mensaje: string,
    cancelButtonText?: string,
    confirmButtonText?: string
  ): Promise<boolean> {
    const resultado = await Swal.fire({
      icon: icono,
      title: titulo,
      text: mensaje,
      showCancelButton: cancelButtonText ? true : false,
      cancelButtonText: cancelButtonText || '',
      confirmButtonText: confirmButtonText || 'Aceptar'
    });

    return resultado.isConfirmed;
  }
}
