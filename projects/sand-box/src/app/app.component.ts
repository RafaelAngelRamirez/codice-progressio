import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  IndexedDBService,
  IDBOpciones,
} from '../../../indexed-db/src/lib/indexed-db.service';
import { EstatusConexionService } from '../../../estatus-conexion/src/lib/estatus-conexion.service';
import { forkJoin } from 'rxjs';
import { IDBOpcionesObjectStore } from '../../../indexed-db/src/lib/indexed-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'sand-box';
  datos: any[];

  desde = 0;
  skip = 0;

  datosMostrar: any[] = [];
  buscador = new FormControl();

  ngOnInit() {
    this.estatus.online.subscribe((_) => console.log(_));

    this.buscador.valueChanges.subscribe((value) => {
      this.datosMostrar = this.datos
        .filter((objeto) => {
          return objeto.defaultKeyPath.includes(value);
        })
        .slice(0, 10);
    });
  }

  storeObjects = {
    PARAMETROS: new IDBOpcionesObjectStore('PARAMETROS', 'NOMBRE_PARAMETRO'),
    CONTRATOS: new IDBOpcionesObjectStore('CONTRATOS', '_id'),
  };

  constructor(
    public estatus: EstatusConexionService,
    private idb: IndexedDBService
  ) {
    this.ejemploIndexedDB();
  }

  ejemploIndexedDB() {
    this.idb.debug = true;
    let opciones = new IDBOpciones();
    opciones.nombreBD = 'SIMAPA';

    this.idb
      .inicializar(opciones, Object.values(this.storeObjects))
      .subscribe(() => {
        this.cargarTodo();
      });
  }

  agregarDato() {
    this.idb
      .save(
        {
          [this.storeObjects.PARAMETROS.keyPath]: (Math.random() + '').replace(
            '.',
            ''
          ),
          NOMBRE: 'algo',
        },
        this.storeObjects.PARAMETROS
      )
      .subscribe((servicio) => {
        // this.cargarTodo();
      });
  }

  cargando = false;

  cargarTodo() {
    this.cargando = true;
    console.log('cargando todo');
    this.idb.findAll(this.storeObjects.PARAMETROS).subscribe(
      (datos) => {
        this.datos = datos;
        this.datosMostrar = this.datos;
        this.cargando = false;
      },
      (err) => {
        console.log('error cargando todo', err);
        this.cargando = false;
      }
    );
  }
}
