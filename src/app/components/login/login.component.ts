import { Component, OnInit, NgZone, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';
// import '../assets/login-animation.js';
import '../../../assets/login-animation.js';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public emailCadastro = new FormControl('', [Validators.required, Validators.email]);
  public emailLogin = new FormControl('', [Validators.required, Validators.email]);
  public hide = true;
  public isAuth = false;
  public isCadastro = false;
  public loginValid = false;
  public emailTeste: string;
  public password: string;
  public confirmaSenha = '';
  public userLogin = new Usuario();

  public userCadastro = new Usuario();

  @ViewChild('inputEmailLogin') inputEmailLogin: ElementRef;
  @ViewChild('nomeCadastro') nomeCadastro: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private renderer: Renderer,
    public snackBar: MatSnackBar
  ) { }


  ngAfterViewInit() {
    this.setFocusEmail();
    if (window !== null && window !== undefined) {
      (window as any).initialize();
    }
  }

  ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.isAuth = true;
    } else {
      this.router.navigate(['login']);
    }

  }

  logar() {
    let self = this;

    if (self.emailLogin && self.emailLogin.valid) {
      self.userLogin.email = self.emailLogin.value;
    }

    let loginRequest = {
      email: self.userLogin.email,
      senha: self.userLogin.senha
    };

    this.usuarioService.login(loginRequest).subscribe(
      usuario => {
        if (usuario !== null) {

          localStorage.setItem('user',JSON.stringify(usuario));
          window.location.reload();

          this.router.navigate(['busca']);

          window.setTimeout(function () {
            self.isAuth = true;
          }, 3000);

        } else {
          var userNotFoundMessage: string = "Usuário não encontrado, tente novamente";
          var action: string = '';

          this.snackBar.open(userNotFoundMessage, action, {
            duration: 1000,
            panelClass: ['success-snackbar']
          });
        }
      }
    );
  }

  cadastrar() {
    let self = this;
    self.isCadastro = true;
    this.router.navigate(['cadastro']);
  }

  voltar() {
    let self = this;
    self.isCadastro = false;
  }

  confrimar(): void {
    var self = this;
    const options = {
      enableHighAccuracy: false,
      timeout: 500,
      maximumAge: 0
    };

    if (self.emailCadastro && self.emailCadastro.valid) {
      self.userCadastro.email = self.emailCadastro.value;
    }

    window.navigator.geolocation.watchPosition(function (data) {
      self.userCadastro.dadosUsuarioSessao.latitude = data.coords.latitude.toString();
      self.userCadastro.dadosUsuarioSessao.longitude = data.coords.longitude.toString();
      self.usuarioService.getIP(self.userCadastro);
      // console.log(self.userCadastro);
      
    }, null, options);

    this.usuarioService.salvarUsuario(this.userCadastro).subscribe(
      usuarioResponse => {
        
        if(usuarioResponse !== null){
          
          if(usuarioResponse.email !== null){
        
            self.voltar();
          
          } else {
            var userNotFoundMessage: string = "Dados do cadastro inconsistentes, verifique os campos e tente novamente";
            var action: string = '';
  
            this.snackBar.open(userNotFoundMessage, action, {
              duration: 10000,
              panelClass: ['success-snackbar']
            });
          }
          
        } else {
          var userNotFoundMessage: string = "Dados do cadastro inconsistentes, verifique os campos e tente novamente";
          var action: string = '';

          this.snackBar.open(userNotFoundMessage, action, {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
        }
      }
    );

    
  }

  setFocusEmail() {
    if (this.inputEmailLogin !== null && this.inputEmailLogin !== undefined) {
      this.inputEmailLogin.nativeElement.focus();
    }
  }

  getErrorEmail(email) {
    return email.hasError('required') ? '' : email.hasError('email') ? 'Formato do e-mail é inválido' : '';
  }
  getErrorConfirmPassword(senha) {
    return senha !== null && senha !== undefined && senha !== '' ? 'A confirmação da senha deve ser igual a senha' : '';
  }
}
