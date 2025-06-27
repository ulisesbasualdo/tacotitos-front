import { Component, ElementRef, input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal, ui-modal',
  imports: [],
  template: `
    @if (abierto) {
      <div #uiModalContainerHTML class="ui-modal-container">
        <div class="ui-modal-content">
          <div class="ui-modal-header">
            <h2>{{ title() }}</h2>
          </div>
          <div class="ui-modal-content">
            <ng-content></ng-content>
          </div>
          <div class="ui-modal-footer">
            <button (click)="close()">Cerrar</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .ui-modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    .ui-modal-content {
      background-color: #fff;
      border-radius: 0.25em;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 80%;
      max-width: 600px;
      margin: auto;
    }
    .ui-modal-header {
      background-color: #f1f1f1;
      padding: 1em;
      border-bottom: 1px solid #ccc;
    }
    .ui-modal-content {
      background-color: #fff;
      padding: 1em;
      border-radius: 0.25em;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .ui-modal-footer {
      background-color: #f1f1f1;
      padding: 1em;
      border-top: 1px solid #ccc;
      text-align: right;
    }
    .ui-modal-footer button {
      padding: 0.5em 1em;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 0.25em;
      cursor: pointer;
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeOut {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    .fade-out {
      animation: fadeOut 0.3s ease-in-out forwards;
    }
  `,
})
export class UIModalComponent {
  @ViewChild('uiModalContainerHTML')
  uiModalContainerHTML!: ElementRef<HTMLDivElement>;

  abierto: boolean = false;

  public title = input<string | null>(null);

  open(): void {
    this.abierto = true;
  }
  close(): void {
    const modal = this.uiModalContainerHTML;
    if (modal) {
      modal.nativeElement.classList.add('fade-out');
      setTimeout(() => {
        this.abierto = false;
      }, 300);
    }
  }
}
