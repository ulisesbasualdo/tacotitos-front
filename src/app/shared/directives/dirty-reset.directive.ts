import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  AfterViewChecked,
  AfterViewInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export type OriginalValuesType = Record<string, any>;
export type PositionAndValue = {
  index: number;
  value: string;
};

@Directive({
  selector: '[UIDirtyReset],[appUIDirtyReset]',
  standalone: true,
})
export class UIDirtyResetDirective
  implements AfterViewInit, AfterViewChecked, OnDestroy
{
  @Input({ required: true }) form!: FormGroup;
  @Input() fieldsToExcludeInComparison: string[] = [];

  private initialValues: OriginalValuesType = {};
  private initialValuesSaved = false;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    if (!this.form) {
      return;
    }
    this.form.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateButtonState();
    });
  }

  ngAfterViewChecked(): void {
    if (!this.initialValuesSaved) {
      this.saveInitialValues();
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private saveInitialValues(): void {
    this.initialValues = this.excludeFields(this.form.getRawValue());
    this.initialValuesSaved = true;
  }

  private updateButtonState(): void {
    const formKeys = Object.keys(this.form.value);
    const hasChanges = formKeys.some(key => {
      const currentValue = this.normalizeValue(this.form.value[key]);
      const initialValues = this.normalizeValue(
        this.excludeFields(this.initialValues)[key]
      );
      return currentValue !== initialValues;
    });
    if (hasChanges) {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    } else if (hasChanges === false) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  private normalizeValue(value: any): any {
    switch (true) {
      case value === null || value === undefined || value === '':
        return '';
      case typeof value === 'number':
        return value.toString();
      case typeof value === 'string':
        return value.trim();
      case Array.isArray(value):
        return value.length === 0 ? '' : JSON.stringify(value);
      case value instanceof Object && Object.keys(value).length === 0:
        return '';
      default:
        return value;
    }
  }

  private excludeFields<T extends OriginalValuesType>(
    object: T
  ): Partial<Omit<T, keyof typeof this.fieldsToExcludeInComparison>> {
    const result = { ...object };
    this.fieldsToExcludeInComparison.forEach(field => {
      delete result[field];
    });
    return result;
  }
}
