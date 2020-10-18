import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexdbService {
  // private opciones = new IDBOpciones();
  // readonly _opciones = this.opciones;

  // db: IDBDatabase;

  constructor() {}

  // inicializar(opciones: IDBOpciones = new IDBOpciones()): Observable<this> {
  //   return new Observable((subscriber) => {
  //     const indexDB = window.indexedDB;

  //     if (indexDB) {
  //       const request = indexDB.open(opciones.nombreBD, opciones.version);

  //       request.onsuccess = () => {
  //         this.db = request.result;
  //         subscriber.next(this);
  //         return subscriber.unsubscribe();
  //       };

  //       request.onupgradeneeded = () => {
  //         this.db = request.result;
  //         console.log(`Se creo la bd`, this.db);

  //         const objectStore = this.db.createObjectStore(
  //           opciones.objectStore,
  //           //   { autoIncrement: true }
  //           { keyPath: opciones.keyPath }
  //         );

  //         subscriber.next(this);
  //         return subscriber.unsubscribe();
  //       };

  //       request.onerror = (error) => {
  //         subscriber.error(error);
  //       };
  //     } else {
  //       subscriber.error('Hubo un error');
  //     }
  //   });
  // }

  // save(data): Observable<this> {
  //   return new Observable((subscriber) => {
  //     const request = this.objectStore(this.opciones.objectStore, this.db).add(
  //       data
  //     );

  //     request.onsuccess = () => {
  //       subscriber.next(this);
  //       return subscriber.unsubscribe();
  //     };
  //   });
  // }

  // update(data): Observable<this> {
  //   return new Observable((subscriber) => {
  //     const request = this.objectStore(this.opciones.objectStore, this.db).put(
  //       data
  //     );

  //     request.onsuccess = () => {
  //       subscriber.next(this);
  //     };
  //   });
  // }

  // delete(key): Observable<this> {
  //   return new Observable((subscriber) => {
  //     const request = this.objectStore(
  //       this.opciones.objectStore,
  //       this.db
  //     ).delete(key);

  //     request.onsuccess = () => {
  //       subscriber.next(this);
  //     };
  //   });
  // }

  // findById(key): Observable<this> {
  //   return new Observable((subscriber) => {
  //     const request = this.objectStore(this.opciones.objectStore, this.db).get(
  //       key
  //     );

  //     request.onsuccess = () => {
  //       subscriber.next(this);

  //       return subscriber.unsubscribe();
  //     };
  //   });
  // }

  // findAll() {
  //   let datos = [];
  //   return new Observable<any[]>((subscriber) => {
  //     const request = this.objectStore(
  //       this.opciones.objectStore,
  //       this.db
  //     ).openCursor();

  //     request.onsuccess = (e: any) => {
  //       const cursor = e.target.result;

  //       if (cursor) {
  //         datos.push(cursor.value);
  //         cursor.continue();
  //       } else {
  //         subscriber.next(datos);
  //         return subscriber.unsubscribe();
  //       }
  //     };

  //     request.onerror = (err) => {};
  //   });
  // }

  // private objectStore(objectStore: string, db: IDBDatabase): IDBObjectStore {
  //   //Se repite el object store
  //   let transaction = db.transaction([objectStore], 'readwrite');
  //   return transaction.objectStore(objectStore);
  // }
}

// export class IDBOpciones {
//   constructor(
//     public nombreBD: string = 'default',
//     public version: number = 1,
//     public objectStore: string = 'defaultObjectStore',
//     public keyPath: string = 'defaultKeyPath'
//   ) {}
// }
