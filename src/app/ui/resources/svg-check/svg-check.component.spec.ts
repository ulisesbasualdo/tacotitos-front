import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCheckComponent } from './svg-check.component';

describe('SvgCheckComponent', () => {
  let component: SvgCheckComponent;
  let fixture: ComponentFixture<SvgCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgCheckComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
