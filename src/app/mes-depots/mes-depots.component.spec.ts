import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDepotsComponent } from './mes-depots.component';

describe('MesDepotsComponent', () => {
  let component: MesDepotsComponent;
  let fixture: ComponentFixture<MesDepotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesDepotsComponent]
    });
    fixture = TestBed.createComponent(MesDepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
