import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';
import { MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';
// import '../assets/login-animation.js';
import '../../../assets/login-animation.js';

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

  public userLogin = new Usuario();
  
  public userCadastro = new Usuario();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog : MatDialog,
    private zone: NgZone,
  ) { }


  ngAfterViewInit() {
    (window as any).initialize();
  }

  // login(){
  //   console.log(`email: ${this.email} password: ${this.password}`)
  //   alert(`Email: ${this.email} Password: ${this.password}`)
  // }

  ngOnInit() {
    if(localStorage.getItem('user') === 'teste@cinq.com.br'){
      this.isAuth = true;
    } else {
      this.router.navigate(['login']);
    }
    
  }

  logar(){
    let self = this;
    if(self.emailLogin && self.emailLogin.valid){
      self.userLogin.email = self.emailLogin.value;
    }
    if(self.authService.login(self.userLogin)){

      localStorage.setItem('user', self.userLogin.email);
      
      // console.log(localStorage);
      window.location.reload();
      this.router.navigate(['busca']);
      
      window.setTimeout(function() {
        self.isAuth = true;
      }, 3000);

    } else {
      self.openDialog();
    }
  }

  cadastrar(){
    let self = this;
    self.isCadastro = true;
    this.router.navigate(['cadastro']);
  }

  voltar(){
    let self = this;
    self.isCadastro = false;
  }

  openDialog(): void {
    this.dialog.open(DialogLocale, {
      width: '480px',
    });
  }

  confrimar(): void {
    var self = this;
    // chamar a service para persistir no banco o usuário
    if(self.emailCadastro && self.emailCadastro.valid){
      self.userCadastro.email = self.emailCadastro.value;
    }

    // salvar essas informações
    console.log(self.userCadastro);
  }
  
  getErrorEmail(email) {
    return email.hasError('required') ? '' : email.hasError('email') ? 'Formato do e-mail é inválido' : '';
  }
  getErrorConfirmPassword(senha) {
    return senha !== null && senha !== undefined && senha !== '' ? 'A confirmação da senha deve ser igual a senha' : '';
  }
}
