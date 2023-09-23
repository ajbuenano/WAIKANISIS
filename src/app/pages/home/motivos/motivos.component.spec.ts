import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosComponent } from './motivos.component';

describe('MotivosComponent', () => {
  let component: MotivosComponent;
  let fixture: ComponentFixture<MotivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotivosComponent]
    });
    fixture = TestBed.createComponent(MotivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
