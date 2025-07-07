import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgTimesComponent } from './svg-times.component';

describe('SvgTimesComponent', () => {
  let component: SvgTimesComponent;
  let fixture: ComponentFixture<SvgTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgTimesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
