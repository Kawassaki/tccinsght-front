import { Component, NgZone, OnInit, ViewChild, Renderer } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FormControl, Validators } from '@angular/forms';


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
  

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  salvarUsuario(){
    var self = this;
    self.usuario.email = self.email.value;
    
    this.salvaGeolocation(self.usuario);  

    self.usuarioService.salvarUsuario(self.usuario);
  }


  salvaGeolocation(usuario){
    if(usuario.permiteLocaliacao){
     
      window.navigator.geolocation.getCurrentPosition(function (data) {
        usuario.latitude = data.coords.latitude;
        usuario.longitude = data.coords.longitude;
      });
      

      this.usuarioService.getIP(usuario);

    } else {
      usuario.latitude = null;
      usuario.longitude = null;
      usuario.ipDeAcesso = null;
    }

  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
