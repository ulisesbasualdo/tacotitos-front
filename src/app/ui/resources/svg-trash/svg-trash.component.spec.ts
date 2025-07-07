import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgTrashComponent } from './svg-trash.component';

describe('SvgTrashComponent', () => {
  let component: SvgTrashComponent;
  let fixture: ComponentFixture<SvgTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgTrashComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
