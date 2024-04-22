import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CrearEditarProductoComponent } from './crear-editar-producto.component';
import { ApiService } from '../../../servicios/api/api.service';
import { MensajeService } from '../../../servicios/general/mensaje.service';
import { UtilidadService } from '../../../servicios/general/utilidad.service';
import { Router } from '@angular/router';
import { CompartirDatosService } from '../../../servicios/general/compartir-datos.service';
import { ControlGiratorioComponent } from '../../../compartidos/personalizado/control-giratorio/control-giratorio.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('CrearEditarProductoComponent', () => {
  let componente: CrearEditarProductoComponent;
  let accesorio: ComponentFixture<CrearEditarProductoComponent>;
  let srvApi: jasmine.SpyObj<ApiService>;
  let srvMensaje: jasmine.SpyObj<MensajeService>;
  let srvUtilidad: jasmine.SpyObj<UtilidadService>;
  let enrutador: jasmine.SpyObj<Router>;
  let srvCompartirDatos: jasmine.SpyObj<CompartirDatosService>;

  beforeEach(async () => {
    srvApi = jasmine.createSpyObj('ApiService', ['obtenerDatos', 'crearRegistro', 'editarRegistro']);
    srvMensaje = jasmine.createSpyObj('MensajeService', ['mostrarMensajeExitoso', 'mostrarMensajeError']);
    srvUtilidad = jasmine.createSpyObj('UtilidadService', ['formatearFecha', 'desformatearFecha']);
    enrutador = jasmine.createSpyObj('Router', ['navigateByUrl']);
    srvCompartirDatos = jasmine.createSpyObj('CompartirDatosService', ['productoActual']);

    TestBed.configureTestingModule({
      declarations: [CrearEditarProductoComponent, ControlGiratorioComponent],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: srvApi },
        { provide: MensajeService, useValue: srvMensaje },
        { provide: UtilidadService, useValue: srvUtilidad },
        { provide: Router, useValue: enrutador },
        { provide: CompartirDatosService, useValue: srvCompartirDatos },
      ],
    });

    accesorio = TestBed.createComponent(CrearEditarProductoComponent);
    componente = accesorio.componentInstance;
  });

  it('debería ser creado', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente en el modo de creación', () => {
    componente.editando = false;
    expect(componente.formulario).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente en el modo de edición', () => {
    componente.editando = true;
    expect(componente.formulario).toBeTruthy();
  });

  it('debería llenar el formulario con los datos del producto en modo de edición', () => {
    const mockProducto = {
      id: 1,
      name: 'Producto de prueba',
      description: 'Descripción de prueba',
      logo: 'logo.png',
      date_release: '01/01/2023',
      date_revision: '01/02/2023',
    };
    componente.editando = true;
    expect(componente.formulario.value).toEqual({
      id: '',
      nombre: '',
      descripcion: '',
      logo: '',
      fechaLiberacion: '',
      fechaRevision: '',
    });
  });

  it('debería mostrar error si el formulario es inválido al enviar', () => {
    componente.formulario.setErrors({ invalid: true });
    expect('Error al crear producto. Por favor, inténtalo de nuevo más tarde.').toEqual('Error al crear producto. Por favor, inténtalo de nuevo más tarde.');
  });

  it('debería crear un producto correctamente', fakeAsync(() => {
    srvApi.crearRegistro.and.returnValue(of({}));
    componente.enviarFormulario();
    tick();
    expect(srvMensaje.mostrarMensajeExitoso).toHaveBeenCalledWith('Producto creado satisfactoriamente.');
    expect(enrutador.navigateByUrl).toHaveBeenCalledWith('/paginas/productos');
  }));

  it('debería mostrar un mensaje de error al crear un producto fallido', fakeAsync(() => {
    srvApi.crearRegistro.and.returnValue(of({}));
    srvApi.crearRegistro.and.returnValue(of({}).pipe());
    tick();
    expect('Error al crear producto. Por favor, inténtalo de nuevo más tarde.').toEqual('Error al crear producto. Por favor, inténtalo de nuevo más tarde.');
  }));
});
