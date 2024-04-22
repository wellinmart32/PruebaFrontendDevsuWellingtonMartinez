import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faArrowRight, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../servicios/api/api.service';
import { CompartirDatosService } from '../../servicios/general/compartir-datos.service';
import { MensajeService } from '../../servicios/general/mensaje.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  @ViewChild('dropdownCheckbox') casillaDeVerificacionDesplegable! : ElementRef<HTMLInputElement>;
  listaProductos: any[] = [];
  mensajeError: string = '';
  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  terminoBusqueda: string = '';
  mostrarMenuDesplegable: boolean = false;
  mostrarControlGiratorio: boolean = false;
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
    public enrutador: Router,
    private srvCompartirDatos: CompartirDatosService,
    private srvMensaje: MensajeService
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
    if (pagina >= 1 && pagina <= this.paginasTotales) {
      this.paginaActual = pagina;
    }
  }

  agregarProducto() {
    this.enrutador.navigateByUrl('/paginas/productos/crear-editar');
  }

  editarProducto(producto: any) {
    this.srvCompartirDatos.actualizarProducto(producto);
    const editando = true;
    this.enrutador.navigate(['/paginas/productos/crear-editar', { editando }]);
  }

  async eliminarProducto(producto: any) {
    const id = producto.id;
    const conf = await this.srvMensaje.mostrarMensajeConfirmacion("¿Estas seguro de eliminar el producto " + producto.name + "?");

    if (conf) {
      try {
        this.mostrarControlGiratorio = true;
        let parametros = new HttpParams().set('id', id);
        const puntoFinal = 'bp/products';

        await this.srvApi.eliminarRegistro(puntoFinal, parametros).toPromise();

        this.mostrarControlGiratorio = false;
        this.srvMensaje.mostrarMensajeExitoso("Producto eliminado satisfactoriamente.");
        this.obtenerProductos();
      } catch (error: any) {
        this.mostrarControlGiratorio = false;

        if (error.status === 200) {
          this.srvMensaje.mostrarMensajeExitoso("Producto eliminado satisfactoriamente.");
          this.obtenerProductos();
        } else {
          this.srvMensaje.mostrarMensajeError("Error al eliminar el producto. Por favor, inténtalo de nuevo más tarde.");
          this.mensajeError = 'Error al eliminar el producto. Por favor, inténtalo de nuevo más tarde.';
        }
      }
    }
  }

  alternarMenuDesplegable(evento: any) {
    evento.stopPropagation();
    this.mostrarMenuDesplegable = !this.mostrarMenuDesplegable;
  }
}
