import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private opciones = new IDBOpciones();
  readonly _opciones = this.opciones;

  db: IDBDatabase;

  constructor() {}

  inicializar(opciones: IDBOpciones = new IDBOpciones()): Observable<this> {
    this.opciones = opciones;
    return new Observable((subscriber) => {
      const indexDB = window.indexedDB;

      this.consoleLog('Opciones recibidas: ', this.opciones);

      if (indexDB) {
        const request = indexDB.open(
          this.opciones.nombreBD,
          this.opciones.version
        );

        request.onsuccess = () => {
          this.db = request.result;
          subscriber.next(this);
          subscriber.complete()
        };

        request.onupgradeneeded = (e: any) => {
          this.db = request.result;

          const objectStore = this.db.createObjectStore(
            this.opciones.objectStore,
            //   { autoIncrement: true }
            { keyPath: this.opciones.keyPath }
          );

          let transaction = e.target.transaction;
          transaction.oncomplete = () => {
            subscriber.next(this);
            subscriber.complete()
          };
        };

        request.onerror = (error) => {
          subscriber.error(error);
        };
      } else {
        subscriber.error('Hubo un error');
      }
    });
  }
  save(data): Observable<this> {
    return new Observable((subscriber) => {
      const request = this.objectStore(this.opciones.objectStore, this.db).add(
        data
      );

      request.onsuccess = () => {
        subscriber.next(this);
        subscriber.complete()
      };
    });
  }

  update(data): Observable<this> {
    return new Observable((subscriber) => {
      const request = this.objectStore(this.opciones.objectStore, this.db).put(
        data
      );

      request.onsuccess = () => {
        subscriber.next(this);
        subscriber.complete()
      };
    });
  }

  delete(key): Observable<this> {
    return new Observable((subscriber) => {
      const request = this.objectStore(
        this.opciones.objectStore,
        this.db
      ).delete(key);

      request.onsuccess = () => {
        subscriber.next(this);
      };
    });
  }

  findById(key): Observable<any> {
    return new Observable((subscriber) => {
      const request = this.objectStore(this.opciones.objectStore, this.db).get(
        key
      );

      request.onsuccess = () => {
        subscriber.next(request.result);
        subscriber.complete()
      };
    });
  }

  findAll() {
    let datos = [];
    return new Observable<any[]>((subscriber) => {
      const request = this.objectStore(
        this.opciones.objectStore,
        this.db
      ).openCursor();

      request.onsuccess = (e: any) => {
        const cursor = e.target.result;

        if (cursor) {
          datos.push(cursor.value);
          cursor.continue();
        } else {
          subscriber.next(datos);
          subscriber.complete()
        }
      };

      request.onerror = (err) => {};
    });
  }

  private consoleLog(...args) {
    if (this.opciones.debug) {
      console.log(...args);
    }
  }

  private objectStore(objectStore: string, db: IDBDatabase): IDBObjectStore {
    //Se repite el object store
    this.consoleLog('Obteniendo objectoStore: ', objectStore);
    let transaction = db.transaction([objectStore], 'readwrite');
    return transaction.objectStore(objectStore);
  }
}

export class IDBOpciones {
  constructor(
    public nombreBD: string = 'default',
    public version: number = 1,
    public objectStore: string = 'defaultObjectStore',
    public keyPath: string = 'defaultKeyPath',
    public debug = false
  ) {}
}
