import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IndexedDBService } from '../../../indexed-db/src/lib/indexed-db.service'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'sand-box';
  datos: any[];

  desde = 0;
  skip = 5;

  datosMostrar: any[] = [];
  buscador = new FormControl();

  ngOnInit() {
    this.buscador.valueChanges.subscribe((value) => {
      this.datosMostrar = this.datos
        .filter((objeto) => {
          return objeto.defaultKeyPath.includes(value);
        })
        .slice(0, 10);
    });
  }

  constructor(private idb: IndexedDBService) {
    this.idb.inicializar().subscribe(
      (servicio) => {
        this.cargarTodo();
      },
      (err) => console.log(err),
      () => console.log('complete')
    );
  }

  agregarDato() {
    this.idb
      .save({
        defaultKeyPath: (Math.random() + '').replace('.', ''),
        algo: 'algo',
      })
      .subscribe((servicio) => {
        // this.cargarTodo();
      });
  }

  cargando = false;

  cargarTodo() {
    this.cargando = true;
    console.log('cargando todo');
    this.idb.findAll().subscribe(
      (datos) => {
        this.datos = datos;
        this.datosMostrar = this.datos.slice(this.desde, this.skip);
        this.cargando = false;
      },
      (err) => {
        console.log(err);
        this.cargando = false;
      }
    );
  }
}
