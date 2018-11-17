import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';


@Injectable()
export class EstabelecimentoService {

  constructor(private http: Http) { }

  public buscarEstabelecimentoPorUsuario(param) {
    return this.http.get(environment.apiUrl + '/rest/estabelecimento/buscarEstabelecimentoPorUsuario?idUsuario=' + param)
      .map(response => {
        localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }

  public buscarEstabelecimentoPorPlaceId(placesIds) {
    var params = [];

    placesIds.forEach(function (id) {
      params.push('placesId=' + id || '');
    });
    params = params.join('&');
    
    return this.http.get(environment.apiUrl + '/rest/estabelecimento/buscaEstabelecimentosPorPlacesIds?' + params)
      .map(response => {
        // localStorage.setItem('estabelecimentos', response.json());
        return response.json();
      });
  }

  public salvarEstabelecimento(estabelecimento) {
    console.log(estabelecimento);
    return this.http.post(environment.apiUrl + '/rest/estabelecimento/salvarEstabelecimento', estabelecimento).map(
      response => {
        return response.json();
      }
    );
  }
}

