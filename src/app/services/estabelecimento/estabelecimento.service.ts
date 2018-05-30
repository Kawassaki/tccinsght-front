import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';


@Injectable()
export class EstabelecimentoService {

 baseUrl: string = ''

 constructor(private http: Http) { }

 public getEstabelecimentos(): Observable<any>{

    return this.http.get('https://tcc-api-insight.appspot.com/getEstabelecimento')
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }

  public getEstabelecimentosById(): Observable<any>{

    return this.http.get('https://tcc-api-insight.appspot.com/getEstabelecimentoById')
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }


}


