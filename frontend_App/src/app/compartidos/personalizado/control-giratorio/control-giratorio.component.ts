import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-giratorio',
  template: `
  <div *ngIf="mostrar" class="spinner-container">
    <div class="spinner"></div>
  </div>
`,
styles: [
  `
    .spinner-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
],
})
export class ControlGiratorioComponent {
  @Input() mostrar = false;
}
