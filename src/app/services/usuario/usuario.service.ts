import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsuarioService {

  constructor(
    private http: Http,
    private httpClient: HttpClient
  ) { }

  public salvarUsuario(usuario: Usuario) {
    return this.http.post(environment.apiUrl + '/rest/usuario/salvar', usuario).map(
      response => {
        return response.json();
      }
    );
  }
  public login(loginRequest: any) {
    return this.http.post(environment.apiUrl + '/rest/usuario/entrar', loginRequest).map(
      response => {
        return response.json();
      }
    );
  }

  public getIP(usuario: Usuario) {
    return this.httpClient.get<{ ip: string }>('https://jsonip.com').subscribe(data => {
      usuario.dadosUsuarioSessao.ipAcesso = data.ip;
    });
  }

}
