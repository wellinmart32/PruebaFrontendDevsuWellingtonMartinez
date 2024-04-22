import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ProductosComponent } from './productos.component';
import { ApiService } from '../../servicios/api/api.service';
import { CompartirDatosService } from '../../servicios/general/compartir-datos.service';
import { MensajeService } from '../../servicios/general/mensaje.service';
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';
import { ControlGiratorioComponent } from '../../compartidos/personalizado/control-giratorio/control-giratorio.component';
import { FiltroBusquedaPipe } from '../../compartidos/personalizado/filtro-busqueda.pipe';

describe('AppComponent', () => {
  let componente: ProductosComponent;
  let accesorio: ComponentFixture<ProductosComponent>;
  let srvApi: jasmine.SpyObj<ApiService>;
  let srvCompartirDatos: jasmine.SpyObj<CompartirDatosService>;
  let srvMensaje: jasmine.SpyObj<MensajeService>;

  beforeEach(async () => {
    srvApi = jasmine.createSpyObj('ApiService', ['obtenerDatos', 'eliminarRegistro']);
    srvApi.obtenerDatos.and.returnValue(of());
    srvCompartirDatos = jasmine.createSpyObj('CompartirDatosService', ['actualizarProducto']);
    srvMensaje = jasmine.createSpyObj('MensajeService', ['mostrarMensajeExitoso', 'mostrarMensajeError', 'mostrarMensajeConfirmacion']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'paginas/productos/crear-editar', component: CrearEditarProductoComponent }
      ]), FontAwesomeModule, FormsModule],
      declarations: [ProductosComponent, FiltroBusquedaPipe, ControlGiratorioComponent],
      providers: [
        { provide: ApiService, useValue: srvApi },
        { provide: CompartirDatosService, useValue: srvCompartirDatos },
        { provide: MensajeService, useValue: srvMensaje }
      ]
    }).compileComponents();

    accesorio = TestBed.createComponent(ProductosComponent);
    componente = accesorio.componentInstance;

    spyOn(componente.enrutador, 'navigateByUrl').and.callThrough();
    spyOn(componente, 'obtenerProductos');
  });

  afterEach(() => {
    srvApi.obtenerDatos.calls.reset();
    srvApi.eliminarRegistro.calls.reset();
    srvCompartirDatos.actualizarProducto.calls.reset();
    srvMensaje.mostrarMensajeExitoso.calls.reset();
    srvMensaje.mostrarMensajeError.calls.reset();
    srvMensaje.mostrarMensajeConfirmacion.calls.reset();
  });

  it('debería ser creado', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar listaProductos en ngOnInit', fakeAsync(() => {
    const mockProductos = [{ id: 1, name: 'Producto 1' }, { id: 2, name: 'Producto 2' }];
    srvApi.obtenerDatos.and.returnValue(of(mockProductos));
    accesorio.detectChanges();
    componente.ngOnInit();
    tick();
    expect(componente.obtenerProductos).toHaveBeenCalled();
  }));

  it('debería navegar a /paginas/productos/crear-editar en agregarProducto', () => {
    componente.agregarProducto();
    expect(componente.enrutador.navigateByUrl).toHaveBeenCalledWith('/paginas/productos/crear-editar');
  });

  it('debería actualizar producto en CompartirDatos y navegar a /paginas/productos/crear-editar en editarProducto', () => {
    const mockProducto = { id: 1, name: 'Producto 1' };
    componente.editarProducto(mockProducto);
    expect(srvCompartirDatos.actualizarProducto).toHaveBeenCalledWith(mockProducto);
    expect(componente.enrutador.navigateByUrl).toHaveBeenCalledWith('/paginas/productos/crear-editar');
  });

  it('debería mostrar diálogo de confirmación y eliminar producto en eliminarProducto', fakeAsync(() => {
    const mockProducto = { id: 1, name: 'Producto 1' };
    srvMensaje.mostrarMensajeConfirmacion.and.returnValue(firstValueFrom(of(true)));
    srvApi.eliminarRegistro.and.returnValue(throwError({ status: 200 }));
    componente.eliminarProducto(mockProducto);
    tick();
    expect(srvMensaje.mostrarMensajeConfirmacion).toHaveBeenCalledWith('¿Estas seguro de eliminar el producto Producto 1?');
    expect(srvApi.eliminarRegistro).toHaveBeenCalledWith('bp/products', jasmine.any(Object));
    expect(srvMensaje.mostrarMensajeExitoso).toHaveBeenCalledWith('Producto eliminado satisfactoriamente.');
    expect(componente.obtenerProductos).toHaveBeenCalled();
  }));

  it('debería manejar error al eliminar producto', fakeAsync(() => {
    const mockProducto = { id: 1, name: 'Producto 1' };
    srvMensaje.mostrarMensajeConfirmacion.and.returnValue(firstValueFrom(of(true)));
    srvApi.eliminarRegistro.and.throwError('Error');
    componente.eliminarProducto(mockProducto);
    tick();
    expect(srvMensaje.mostrarMensajeError).toHaveBeenCalledWith('Error al eliminar el producto. Por favor, inténtalo de nuevo más tarde.');
  }));
});
