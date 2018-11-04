import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';


@Injectable()
export class EstabelecimentoService {

 constructor(private http: Http) { }

 public buscarEstabelecimentoPorUsuario(param){
    return this.http.get( environment.apiUrl + '/rest/estabelecimento/buscarEstabelecimentoPorUsuario?idUsuario=' + param)
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }

//   public getEstabelecimentosById(): Observable<any>{
//     return this.http.get(environment.apiUrl + '/rest/testJersey')
//       .map(response => {
//         localStorage.setItem('estabelecimentos', response.json());
//         return response.json();
//       });
//   }

  public salvarEstabelecimento(estabelecimento){
    console.log(estabelecimento);
    return this.http.post(environment.apiUrl + '/rest/estabelecimento/salvarEstabelecimento', estabelecimento).map(
        response => {
          return response.json();
        }
      );
  }

//   public getInfoByPlaceId(place): Observable<any>{
//     console.log(place);
//     return this.http.get(environment.apiUrl + '/rest/testJersey')
//     .map(response => {
//       localStorage.setItem('estabelecimentos', response.json());
//       return response.json();
//     });
//   }
}


