import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatusConexionComponent } from './estatus-conexion.component';

describe('EstatusConexionComponent', () => {
  let component: EstatusConexionComponent;
  let fixture: ComponentFixture<EstatusConexionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatusConexionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatusConexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
