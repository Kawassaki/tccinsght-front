import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';


@Injectable()
export class EstabelecimentoService {

 constructor(private http: Http) { }

 public getEstabelecimentos(): Observable<any>{
    return this.http.get( environment.apiUrl + '/rest/testJersey/testJerseyComPath')
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }

  public getEstabelecimentosById(): Observable<any>{
    return this.http.get(environment.apiUrl + '/rest/testJersey')
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }

  public salvarEstabelecimento(estabelecimento): Observable<any>{
    console.log(estabelecimento);
    return this.http.post(environment.apiUrl + '/rest/testJersey', estabelecimento);
  }
}


