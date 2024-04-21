import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroBusqueda'
})
export class FiltroBusquedaPipe implements PipeTransform {

  transform(items: any[], terminoBusqueda: string): any[] {
    if  (!items || !terminoBusqueda) {
      return items;
    }

    terminoBusqueda = terminoBusqueda.toLocaleLowerCase();

    return items.filter(item => {
      return item.name.toLocaleLowerCase().includes(terminoBusqueda);
    })
  }

}
