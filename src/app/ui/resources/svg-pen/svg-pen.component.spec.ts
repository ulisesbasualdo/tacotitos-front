import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPenComponent } from './svg-pen.component';

describe('SvgPenComponent', () => {
  let component: SvgPenComponent;
  let fixture: ComponentFixture<SvgPenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
