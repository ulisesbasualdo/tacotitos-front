import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalsasComponent } from './salsas.component';

describe('SalsasComponent', () => {
  let component: SalsasComponent;
  let fixture: ComponentFixture<SalsasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalsasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalsasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
