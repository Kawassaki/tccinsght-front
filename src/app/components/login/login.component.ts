import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';
import { MatDialog } from '@angular/material';
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
  private returnUrl: string;
  public isAuth = false;
  public isCadastro = false;
  public loginValid = false;
  public emailTeste: string;
  public password: string;
  public confirmaSenha = '';
  public userLogin = new Usuario();

  public userCadastro = new Usuario();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private zone: NgZone,
    private usuarioService: UsuarioService
  ) { }


  ngAfterViewInit() {
    if (window !== null && window !== undefined) {
      (window as any).initialize();
    }

  }

  // login(){
  //   console.log(`email: ${this.email} password: ${this.password}`)
  //   alert(`Email: ${this.email} Password: ${this.password}`)
  // }

  ngOnInit() {
    if (localStorage.getItem('user') === 'teste@cinq.com.br') {
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
    if (self.authService.login(self.userLogin)) {

      localStorage.setItem('user', self.userLogin.email);

      // console.log(localStorage);
      window.location.reload();
      this.router.navigate(['busca']);

      window.setTimeout(function () {
        self.isAuth = true;
      }, 3000);

    }
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
    // chamar a service para persistir no banco o usuário
    if (self.emailCadastro && self.emailCadastro.valid) {
      self.userCadastro.email = self.emailCadastro.value;
    }

    // var usuarioTest: Usuario;
    // usuarioTest.primeiroNome = "Brenda";
    // usuarioTest.segundoNome = "Sakai";
    // usuarioTest.senha = "Briz2018@";
    // usuarioTest.email = "bresakai@gmail.com";
    // usuarioTest.dadosUsuarioSessao.latitude = "-23,55052";
    // usuarioTest.dadosUsuarioSessao.longitude = "-46,633309";
    
    this.userCadastro.dadosUsuarioSessao.latitude = "-23,55052";
    this.userCadastro.dadosUsuarioSessao.longitude = "-46,633309";
    this.usuarioService.getIP(this.userCadastro);

    this.usuarioService.salvarUsuario(this.userCadastro);
    // salvar essas informações
    // console.log(self.userCadastro);
  }

getErrorEmail(email) {
  return email.hasError('required') ? '' : email.hasError('email') ? 'Formato do e-mail é inválido' : '';
}
getErrorConfirmPassword(senha) {
  return senha !== null && senha !== undefined && senha !== '' ? 'A confirmação da senha deve ser igual a senha' : '';
}
}
