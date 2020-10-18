import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  db: IDBDatabase;
  debug = false;
  constructor() {}

  /**
   * *Inicializamos la conexion a IndexedDB
   * Para abstraer mas este servicio separamos las opciones generales de la BD
   * con las de ObjectStore
   *
   * @param {*} [opciones=new IDBOpciones()]
   * @param {IDBOpcionesObjectStore[]} iDBOpcionesObjectStore
   * @returns {Observable<this>}
   * @memberof IndexedDBService
   */
  /**
   *
   *
   * @param {IDBOpciones} opciones Las opciones de inicializacion de la BD
   * @param {IDBOpcionesObjectStore[]} iDBOpcionesObjectStore Las opciones de cada ObjectSotre en un arreglo para inicializarlas todas juntas.
   * @returns {Observable<this>}Retorna este servicio.
   * @memberof IndexedDBService
   */
  inicializar(
    opciones: IDBOpciones,
    iDBOpcionesObjectStore: IDBOpcionesObjectStore[]
  ): Observable<this> {
    return new Observable((subscriber) => {
      // Comprobamos si el navegador es compatible
      const indexDB = window.indexedDB;
      this.consoleLog('[ INICIALIZAR ] Navegador compatible: ', !!indexDB);

      if (indexDB) {
        this.consoleLog(
          '[ INICIALIZAR ] Incializando con estas opciones:',
          iDBOpcionesObjectStore
        );

        this.consoleLog('[ INICIALIZAR ] Abriendo conexion...');
        const request = indexDB.open(opciones.nombreBD, opciones.version);
        request.onsuccess = () => {
          this.consoleLog(`[ INICIALIZAR ] Operacion realizada...`);
          this.db = request.result;
          subscriber.next(this);
          subscriber.complete();
        };

        request.onupgradeneeded = (e: any) => {
          this.consoleLog(
            `[ INICIALIZAR ] Configurando base de datos...`,
            iDBOpcionesObjectStore
          );

          this.db = request.result;

          iDBOpcionesObjectStore.forEach((obs) => {
            this.consoleLog(
              '[ INICIALIZAR ] Creando objectStore: ',
              obs.objectStore
            );
            this.consoleLog('[ INICIALIZAR ] Asignando keypath: ', obs.keyPath);
            this.db.createObjectStore(obs.objectStore, {
              keyPath: obs.keyPath,
            });
          });

          let transaction = e.target.transaction;
          transaction.oncomplete = () => {
            this.consoleLog(
              '[ INICIALIZAR ] Configuracion terminada con exito...'
            );
            subscriber.next(this);
            subscriber.complete();
          };
        };

        request.onerror = (error) => {
          this.consoleLog('[ INICIALIZAR ] Hubo un error...', error);
          subscriber.error(error);
        };
      } else {
        this.consoleLog(
          '[ INICIALIZAR ] Navegador no compatible con indexedDB...'
        );
        subscriber.error('Hubo un error');
      }
    });
  }

  save(data, iDBOpcionesObjectStore: IDBOpcionesObjectStore): Observable<this> {
    return new Observable((subscriber) => {
      this.consoleLog(
        '[ SAVE ] Guardando datos en ',
        iDBOpcionesObjectStore,
        data
      );
      const request = this.objectStore(
        iDBOpcionesObjectStore.objectStore,
        this.db
      ).add(data);

      request.onsuccess = () => {
        this.consoleLog('[ SAVE ] Datos almacenados con exito');
        subscriber.next(this);
        subscriber.complete();
      };

      request.onerror = (err) => {
        console.error('[ SAVE ] Error en save: ', data, err);
        subscriber.error(err);
      };
    });
  }

  update(
    data,
    iDBOpcionesObjectStore: IDBOpcionesObjectStore
  ): Observable<this> {
    return new Observable((subscriber) => {
      this.consoleLog(
        '[ UPDATE ] Actualizando datos: ',
        data,
        iDBOpcionesObjectStore
      );
      const request = this.objectStore(
        iDBOpcionesObjectStore.objectStore,
        this.db
      ).put(data);

      request.onsuccess = () => {
        this.consoleLog('[ UPDATE ] Datos actualizados correctamente...');
        subscriber.next(this);
        subscriber.complete();
      };

      request.onerror = (err) => {
        console.error('[ UPDATE ] Error en update: ', data, err);
        subscriber.error(err);
      };
    });
  }

  delete(
    key,
    iDBOpcionesObjectStore: IDBOpcionesObjectStore
  ): Observable<this> {
    return new Observable((subscriber) => {
      this.consoleLog(
        '[ DELETE ] Eliminado datos: ',
        key,
        iDBOpcionesObjectStore
      );
      const request = this.objectStore(
        iDBOpcionesObjectStore.objectStore,
        this.db
      ).delete(key);

      request.onsuccess = () => {
        this.consoleLog('[ DELETE ] Se elimino correctamente...');
        subscriber.next(this);
        subscriber.complete();
      };

      request.onerror = (err) => {
        console.error('[ DELETE ] Error en delete: ', key, err);
        subscriber.error(err);
      };
    });
  }

  findById(
    key,
    iDBOpcionesObjectStore: IDBOpcionesObjectStore
  ): Observable<any> {
    return new Observable((subscriber) => {
      this.consoleLog(
        '[ FIND_BY_ID ] Buscando por id: ',
        key,
        iDBOpcionesObjectStore
      );

      const request = this.objectStore(
        iDBOpcionesObjectStore.objectStore,
        this.db
      ).get(key);

      request.onsuccess = () => {
        this.consoleLog('[ FIND_BY_ID ] Se encontro el objeto...');
        subscriber.next(request.result);
        subscriber.complete();
      };

      request.onerror = (err) => {
        console.error('[ FIND_BY_ID ] Error en findById: ', key, err);
        subscriber.error(err);
      };
    });
  }

  findAll(iDBOpcionesObjectStore: IDBOpcionesObjectStore) {
    let datos = [];
    return new Observable<any[]>((subscriber) => {
      this.consoleLog('Buscando todos los datos:', iDBOpcionesObjectStore);
      const request = this.objectStore(
        iDBOpcionesObjectStore.objectStore,
        this.db
      ).openCursor();
      let contador = 0;
      request.onsuccess = (e: any) => {
        this.consoleLog('[ FIND ALL ] Elemento cargado: ', contador);
        const cursor = e.target.result;

        if (cursor) {
          datos.push(cursor.value);
          cursor.continue();
          contador++;
        } else {
          subscriber.next(datos);
          subscriber.complete();
        }
      };

      request.onerror = (err) => {
        console.error('[ FIND ALL ]  Error en findAll: ', err);
        subscriber.error(err);
      };
    });
  }

  private consoleLog(...args) {
    if (this.debug) {
      console.log(...args);
    }
  }

  /**
   *Obtiene el objectStore, que seria el equivalente a una colleccion en mongodb pero con una convinacion de request. ????
   *
   * @private
   * @param {string} objectStore El nombre del objectStore
   * @param {IDBDatabase} db La BD inicializada
   * @returns {IDBObjectStore} El objeto para aplicar las transacciones
   * @memberof IndexedDBService
   */
  private objectStore(objectStore: string, db: IDBDatabase): IDBObjectStore {
    //Se repite el object store
    this.consoleLog('[ OBJECT STORE ] Obteniendo objectoStore: ', objectStore);
    let transaction = db.transaction([objectStore], 'readwrite');
    this.consoleLog('[ OBJECT STORE ] Se obtuvo el objectStore:', transaction);
    return transaction.objectStore(objectStore);
  }
}

/**
 *Guarda los datos necesarios para crear una base de datos.
 *
 * @export
 * @class IDBOpciones
 */
export class IDBOpciones {
  constructor(
    public nombreBD: string = 'default',
    public version: number = 1
  ) {}
}

/**
 *Crea un objeto que almacena la informacion necesarioa para gestionar un object store
 *
 * @export
 * @class IDBOpcionesObjectStore
 */
export class IDBOpcionesObjectStore {
  /**
   *Gestiona las opciones para el objectostore.
   * @param {string} [objectStore='defaultObjectStore'] El nombre del objecstore deseado
   * @param {string} [keyPath='defaultKeyPath'] El key del objeto que se usara como key en el objecstore, por ejemeplo un campo `_id`
   * @memberof IDBOpcionesObjectStore
   */
  constructor(
    public objectStore: string = 'defaultObjectStore',
    public keyPath: string = 'defaultKeyPath'
  ) {}
}
