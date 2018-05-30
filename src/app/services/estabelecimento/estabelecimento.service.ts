import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';


@Injectable()
export class EstabelecimentoService {

 baseUrl: string = ''

 constructor(private http: Http) { 
   if (!environment.jsonData) {
      this.baseUrl = environment.apiUrl + '/estabelecimento';
    }
 }

 public getEstabelecimentos(): Observable<any>{

  if (environment.jsonData) {
    return this.http.get('https://tcc-api-insight.appspot.com/getEstabelecimento')
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });

    } else {
      return this.http.get(this.baseUrl).map(response => response.json());
    }
  }


}


