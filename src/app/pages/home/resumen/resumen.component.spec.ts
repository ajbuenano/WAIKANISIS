import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenComponent } from './resumen.component';

describe('ResumenComponent', () => {
  let component: ResumenComponent;
  let fixture: ComponentFixture<ResumenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenComponent]
    });
    fixture = TestBed.createComponent(ResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
