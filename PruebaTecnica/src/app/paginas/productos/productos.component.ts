import { Component } from '@angular/core';
import { faArrowLeft, faArrowRight, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../servicios/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  listaProductos: any[] = [];
  mensajeError: string = '';
  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  terminoBusqueda: string = '';
  listaItemsPorPagina = [
    {
      valor: 5,
      etiqueta: '5'
    },
    {
      valor: 10,
      etiqueta: '10'
    },
    {
      valor: 20,
      etiqueta: '20'
    }
  ];

  faFlechaIzquierda = faArrowLeft;
  faFlechaDerecha = faArrowRight;
  faEditar = faEdit;
  faBorrar = faTrashAlt;
  hayResultados: boolean = false;

  constructor(
    private srvApi: ApiService,
    public router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.obtenerProductos();
  }

  async obtenerProductos() {
    try {
      let endPoint = "bp/products";
      this.listaProductos = [];
      const datos = await this.srvApi.obtenerDatos(endPoint).toPromise();
      this.listaProductos = datos;
    }catch (error: any) {
      this.mensajeError = 'Error al obtener productos financieros. Por favor, inténtalo de nuevo más tarde.';
    }
  }

  get productosPaginados() : any[] {
    const indiceInicial = (this.paginaActual - 1) * this.itemsPorPagina;
    const indiceFinal = indiceInicial + this.itemsPorPagina;
    return this.listaProductos.slice(indiceInicial, indiceFinal);
  }

  get paginasTotales(): number {
    return Math.ceil(this.listaProductos.length / this.itemsPorPagina);
  }

  irAPagina(pagina: number) {
    alert('alerta');
    console.log('yendo a pagina ' + pagina);
    if (pagina >= 1 && pagina <= this.paginasTotales) {
      this.paginaActual = pagina;
    }
  }
}
