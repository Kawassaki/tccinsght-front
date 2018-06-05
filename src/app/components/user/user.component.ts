import { Component, NgZone, OnInit, ViewChild, Renderer } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public usuario = new Usuario();
  private color = 'accent';
  public checked: boolean;
  public disabled: boolean;
  

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  salvarUsuario(){
    var self = this;
    
    this.salvaGeolocation(self.usuario);  

    self.usuarioService.salvarUsuario(self.usuario);
  }


  salvaGeolocation(usuario){
    
    if(usuario.permiteLocaliacao){
     
      window.navigator.geolocation.getCurrentPosition(function (data) {
        usuario.latitude = data.coords.latitude;
        usuario.longitude = data.coords.longitude;
      });

      this.usuarioService.setIP(usuario);
      
    } else {
      usuario.latitude = null;
      usuario.longitude = null;
      usuario.ipDeAcesso = null;
    }

  }

}
