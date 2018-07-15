import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../models/usuario';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  public login(user : Usuario){
    if(user.email === 'teste@cinq.com.br' && user.senha === 'cinq@2018'){
      return true;
    } else {
      return false;
    }
  }

}
