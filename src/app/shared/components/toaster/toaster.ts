import { Component, inject } from '@angular/core';
import { ToasterController } from './toaster-controller';
@Component({
  standalone: true,
  selector: 'app-toaster',
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss',
})
export class Toaster {
  toasterController = inject(ToasterController);
}
