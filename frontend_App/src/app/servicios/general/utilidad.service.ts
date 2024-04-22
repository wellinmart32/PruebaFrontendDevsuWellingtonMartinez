import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor() { }

  formatearFecha(cadenaFecha: string): string {
    const [dia, mes, anio] = cadenaFecha.split('/');
    const formatoFecha  = new Date(`${anio}-${mes}-${dia}`);

    if (isNaN(formatoFecha.getTime())) {
      console.error('Fecha no válida:', cadenaFecha);
      return '';
    }

    const formatoAnio = formatoFecha.getFullYear();
    const formatoMes = (formatoFecha.getMonth() + 1).toString().padStart(2, '0');
    const formatoDia = formatoFecha.getUTCDate().toString().padStart(2, '0');

    return `${formatoAnio}-${formatoMes}-${formatoDia}`;
  }

  desformatearFecha(fechaString: string): string {
    const subCadenaFecha = fechaString.substring(0, 10);
    const partesFecha = subCadenaFecha.split("-");
    const nuevaFecha = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    return nuevaFecha;
  }
}
