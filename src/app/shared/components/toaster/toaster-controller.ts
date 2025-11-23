import { Injectable, signal, WritableSignal } from '@angular/core';

export type ToasterType = 'info' | 'danger' | 'warning' | 'success';
export interface Toast {
  id: number;
  title: string;
  description: string;
  type: ToasterType;
  isOpen: WritableSignal<boolean>;
}

@Injectable({ providedIn: 'root' })
export class ToasterController {
  public toasts = signal<Toast[]>([]);
  private counter: number = 0;

  show(
    title: string,
    description: string,
    type: ToasterType = 'info',
    autoCloseMs: number = 3000
  ) {
    const id = ++this.counter;
    const isOpen = signal(false);
    const toast: Toast = { id, title, description, type, isOpen };

    this.toasts.update(list => [...list, toast]);

    queueMicrotask(() => isOpen.set(true));

    if (autoCloseMs > 0) {
      setTimeout(() => this.close(id), autoCloseMs);
    }
  }

  close(id: number) {
    const toast = this.toasts().find(t => t.id === id);
    if (!toast) return;

    toast.isOpen.set(false);

    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
