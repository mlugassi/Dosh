import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QubicViewComponent } from './qubic-view.component';

describe('QubicViewComponent', () => {
  let component: QubicViewComponent;
  let fixture: ComponentFixture<QubicViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QubicViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QubicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
