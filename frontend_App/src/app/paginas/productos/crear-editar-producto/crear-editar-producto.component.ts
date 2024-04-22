import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../servicios/api/api.service';
import { MensajeService } from '../../../servicios/general/mensaje.service';
import { UtilidadService } from '../../../servicios/general/utilidad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompartirDatosService } from '../../../servicios/general/compartir-datos.service';
import { HttpParams } from '@angular/common/http';

const hoy = new Date();
hoy.setUTCHours(hoy.getUTCHours() - 5);
const dd = String(hoy.getUTCDate()).padStart(2, '0');
const mm = String(hoy.getUTCMonth() + 1).padStart(2, '0');
const aaaa = hoy.getUTCFullYear();

const patronFecha = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

@Component({
  selector: 'app-crear-editar-producto',
  templateUrl: './crear-editar-producto.component.html',
  styleUrl: './crear-editar-producto.component.scss'
})
export class CrearEditarProductoComponent {
  @Input() editando: boolean = false;

  formulario: FormGroup;
  mensajeError: string = '';
  mostrarControlGiratorio: boolean = false;

  constructor(
    private cF: FormBuilder,
    private srvApi: ApiService,
    private srvMensaje: MensajeService,
    private srvUtilidad: UtilidadService,
    private srvCompartirDatos: CompartirDatosService,
    private enrutador: Router,
    private rutaActivada: ActivatedRoute
  ) {
    this.formulario = this.cF.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ],
      [this.validadorAsincronoDeId()]
    ],
      nombre: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]],
      logo: ['', [Validators.required]],
      fechaLiberacion: ['', [
        Validators.required,
        Validators.pattern(patronFecha),
        this.validadorFechaDeLiberacion,
      ]],
      fechaRevision: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const editando = this.rutaActivada.snapshot.paramMap.get('editando') === 'true';

    if (editando) {
      this.mostrarControlGiratorio = true;
      this.srvCompartirDatos.productoActual.subscribe(producto => {
        if (producto) {
          this.mostrarControlGiratorio = false;
          this.formulario = this.cF.group({
            id: ['', [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(10),
            ]],
            nombre: ['', [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ]],
            descripcion: ['', [
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(100),
            ]],
            logo: ['', [Validators.required]],
            fechaLiberacion: ['', [
              Validators.required,
              Validators.pattern(patronFecha),
              this.validadorFechaDeLiberacion,
            ]],
            fechaRevision: ['', [Validators.required]]
          });
          this.editando = true;
          this.llenarFormulario(producto);
        } else {
          this.mostrarControlGiratorio = false;
          this.editando = false;
        }
      });
    }
  }

  llenarFormulario(producto: any) {
    let formularioEditado = {
      id: producto.id,
      nombre: producto.name,
      descripcion: producto.description,
      logo: producto.logo,
      fechaLiberacion: this.srvUtilidad.desformatearFecha(producto.date_release),
      fechaRevision: this.srvUtilidad.desformatearFecha(producto.date_revision)
    }
    this.formulario.patchValue(formularioEditado);
    console.log(this.editando);
  }

  errorEnValidacion(controlNombre: string) {
    let control: any = this.formulario.get(controlNombre);
    return (
      control.invalid && control.touched
    );
  }

  controlTieneError(controlNombre: string, tipoError: string): boolean {
    const control = this.formulario.get(controlNombre);
    return (control?.hasError(tipoError) && control?.touched) ?? false;
  }

  validadorAsincronoDeId(): ValidatorFn {
    return (control: AbstractControl) : Promise<ValidationErrors | null> => {
      let id = control.value;
      if (!id || id.length < 3 || id.length > 10) {
        return Promise.resolve(null);
      }

      let parametros = new HttpParams().set('id', control.value);

      let puntoFinal = "bp/products/verification";

      return this.srvApi.obtenerDatos(puntoFinal, parametros).toPromise()
        .then(datos => {
          if (this.editando) {
            return null;
          } else if (datos === true) {
            return { 'invalidId': true };
          } else {
            return null;
          }
        })
        .catch(() => null);
    };
  }

  validadorFechaDeLiberacion(control: FormControl) {
    const fechaDeEntrada = control.value;

    if (!patronFecha.test(fechaDeEntrada)) {
      return { invalidFormat: true };
    }

    const [diaDeEntrada, mesDeEntrada, AnioDeEntrada] = fechaDeEntrada.split('/');
    const fechaDeEntradaAnalizada = new Date(AnioDeEntrada + '-' + mesDeEntrada + '-' + diaDeEntrada);

    if (
      fechaDeEntradaAnalizada.toString() === 'Invalid Date' ||
      fechaDeEntradaAnalizada.getTime() < hoy.getTime()
    ) {
      return { dateIsPast: true };
    }

    return null;
  }

  llenarFechaRevision(evento: any) {
    let fechaLiberacion = evento.target.value;
    if (fechaLiberacion.length != 10) {
      return;
    } else {
      let cadenaAnio = fechaLiberacion.substring(6, 10);
      let anio = parseInt(cadenaAnio, 10) + 1;
      let fechaRevision = `${fechaLiberacion.substring(0, 6)}${anio}${fechaLiberacion.substring(10)}`;
      this.formulario.get('fechaRevision')?.setValue(fechaRevision);
    }
  }

  volverAFormulario() {
    this.editando = false;
    this.reiniciarFormulario();
    this.enrutador.navigateByUrl('paginas/productos');
  }

  reiniciarFormulario() {
    const id = this.formulario.get('id')?.value;
    this.formulario.reset();
    this.formulario.get('id')?.setValue(id);
  }

  enviarFormulario() {
    if (this.editando) {
      this.editarProducto();
    } else {
      this.crearProducto();
    }
  }

  crearProducto() {
    this.mostrarControlGiratorio = true;
    let puntoFinal = "bp/products";
    let cuerpo = {
      id: this.formulario.get("id")?.value,
      name: this.formulario.get("nombre")?.value,
      description: this.formulario.get("descripcion")?.value,
      logo: this.formulario.get("logo").value,
      date_release: this.srvUtilidad.formatearFecha(this.formulario.get("fechaLiberacion")?.value),
      date_revision: this.srvUtilidad.formatearFecha(this.formulario.get("fechaRevision")?.value)
    };
    this.srvApi.crearRegistro(puntoFinal, cuerpo).subscribe(
      (datos: any) => {
        this.mostrarControlGiratorio = false;
        this.srvMensaje.mostrarMensajeExitoso("Producto creado satisfactoriamente.");
        this.enrutador.navigateByUrl('/paginas/productos');
      },
      error => {
        this.mostrarControlGiratorio = false;
        this.srvMensaje.mostrarMensajeError('Error al crear producto. Por favor, inténtalo de nuevo más tarde.');
        this.mensajeError = 'Error al crear producto. Por favor, inténtalo de nuevo más tarde.';
        console.error(this.mensajeError, error);
      }
    );
  }

  editarProducto() {
    this.mostrarControlGiratorio = true;
    let puntoFinal = "bp/products";
    let body = {
      id: this.formulario.get("id")?.value,
      name: this.formulario.get("nombre")?.value,
      description: this.formulario.get("descripcion")?.value,
      logo: this.formulario.get("logo")?.value,
      date_release: this.srvUtilidad.formatearFecha(this.formulario.get("fechaLiberacion")?.value),
      date_revision: this.srvUtilidad.formatearFecha(this.formulario.get("fechaRevision")?.value),
    }
    this.srvApi.editarRegistro(puntoFinal, body).subscribe(
      (datos: any) => {
        this.mostrarControlGiratorio = false;
        this.srvMensaje.mostrarMensajeExitoso("Producto actualizado satisfactoriamente.");
        this.enrutador.navigateByUrl('/paginas/productos');
      },
      error => {
        this.mostrarControlGiratorio = false;
        this.srvMensaje.mostrarMensajeError('Error al actualizar producto. Por favor, inténtalo de nuevo más tarde.');
        this.mensajeError = 'Error al actualizar producto. Por favor, inténtalo de nuevo más tarde.';
        console.error(this.mensajeError, error);
      }
    );
  }

}
