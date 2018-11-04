import { Component, NgZone, OnInit, ViewChild, Renderer } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public usuario = new Usuario();
  public color = 'accent';
  public checked: boolean;
  public disabled: boolean;
  public email = new FormControl('', [Validators.required, Validators.email]); 
  

  constructor(private usuarioService: UsuarioService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    var self = this;
    if(localStorage.getItem('user') !== null && localStorage.getItem('user')){
      let usuarioStorage = JSON.parse(localStorage.getItem('user'));
      self.usuario.email = usuarioStorage.email;
      self.usuario.primeiroNome = usuarioStorage.primeiroNome;
      self.usuario.segundoNome = usuarioStorage.segundoNome;
    }
  }

  salvarUsuario(){
    var self = this;
    self.usuario.email = self.email.value;
    
    this.usuarioService.salvarUsuario(self.usuario).subscribe(
      usuarioResponse => {
        
        if(usuarioResponse !== null){
          
          if(usuarioResponse.email !== null){
        
            var userNotFoundMessage: string = "Salvo com Sucesso! :)";
            var action: string = '';
  
            self.snackBar.open(userNotFoundMessage, action, {
              duration: 10000,
              panelClass: ['success-snackbar']
            });
          
          } else {
            var userNotFoundMessage: string = "Dados do cadastro inconsistentes, verifique os campos e tente novamente";
            var action: string = '';
  
            self.snackBar.open(userNotFoundMessage, action, {
              duration: 10000,
              panelClass: ['success-snackbar']
            });
          }
          
        } else {
          var userNotFoundMessage: string = "Dados do cadastro inconsistentes, verifique os campos e tente novamente";
          var action: string = '';

          self.snackBar.open(userNotFoundMessage, action, {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
        }
      }
    );
  }


  salvaGeolocation(usuario){
    if(usuario.permiteLocaliacao){
     
      window.navigator.geolocation.getCurrentPosition(function (data) {
        usuario.latitude = data.coords.latitude;
        usuario.longitude = data.coords.longitude;
      });
      

      // this.usuarioService.getIP(usuario);

    } else {
      usuario.latitude = null;
      usuario.longitude = null;
      usuario.ipDeAcesso = null;
    }

  }

  getErrorConfirmPassword(senha) {
    return senha !== null && senha !== undefined && senha !== '' ? 'A confirmação da senha deve ser igual a senha' : '';
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Digite seu E-mail' :
      this.email.hasError('email') ? 'E-mail inválido' :
        '';
  }

}
