import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleChipsComponent } from './select-multiple-chips.component';

describe('SelectMultipleChipsComponent', () => {
  let component: SelectMultipleChipsComponent;
  let fixture: ComponentFixture<SelectMultipleChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMultipleChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMultipleChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
