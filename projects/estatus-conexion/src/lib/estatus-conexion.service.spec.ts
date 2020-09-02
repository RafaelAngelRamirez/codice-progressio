import { TestBed } from '@angular/core/testing';

import { EstatusConexionService } from './estatus-conexion.service';

describe('EstatusConexionService', () => {
  let service: EstatusConexionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstatusConexionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
