import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSaveComponent } from './svg-save.component';

describe('SvgSaveComponent', () => {
  let component: SvgSaveComponent;
  let fixture: ComponentFixture<SvgSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgSaveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
