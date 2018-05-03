import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class QuerySelectorService {

  constructor() { }

  private _listners = new Subject<any>();

  listen(): Observable<any> {
     return this._listners.asObservable();
  }

  queryStringService(filterBy: string) {
     this._listners.next(filterBy);
  }

}
