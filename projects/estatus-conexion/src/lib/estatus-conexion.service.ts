import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstatusConexionService {
  public readonly online = new BehaviorSubject<boolean>(true);

  constructor() {
    window.addEventListener('online', (e) => this.online.next(true));
    window.addEventListener('offline', (e) => this.online.next(false));
  }
}
