import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPlusComponent } from './svg-plus.component';

describe('SvgPlusComponent', () => {
  let component: SvgPlusComponent;
  let fixture: ComponentFixture<SvgPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPlusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
