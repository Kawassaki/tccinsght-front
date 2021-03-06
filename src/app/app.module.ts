import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { MaterialDesingModule } from './modules/material-desing/material-desing.module';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RoutingModule } from './routing.module';
import { CadastroEstabelecimentoComponent } from './components/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { QuestionarioComponent } from './components/questionario/questionario.component';
import { EstabelecimentoService } from './services/estabelecimento/estabelecimento.service';
import { UsuarioService } from './services/usuario/usuario.service';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { DialogLocale } from './components/dialogs/dialog-locale/dialogs.component';
import { AuthenticationService } from './services/authentication.service';
import { AvatarModule } from 'ng2-avatar';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { ModalDetailsComponent }from './components/dialogs/modal-details/modal-details.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { CpfCnpjModule } from 'ng2-cpf-cnpj';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { DialogFaqComponent } from './components/dialogs/dialog-faq/dialog-faq.component';
import { DialogTermosComponent } from './components/dialogs/dialog-termos/dialog-termos.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("831675641660-g4mq7g691tqbgf86qcrmllnvea5imhgm.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("1487798564656572")
  }
]);
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MapComponent,
    MenuComponent,
    LoginComponent,
    MapComponent,
    PageNotFoundComponent,
    CadastroEstabelecimentoComponent,
    HomePageComponent,
    QuestionarioComponent,
    SnackBarComponent,
    DialogLocale,
    CadastrarComponent,
    ModalDetailsComponent,
    DialogFaqComponent,
    DialogTermosComponent,
           
  ],
  imports: [
    BrowserModule,
    MaterialDesingModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    AvatarModule.forRoot(),
    CreditCardDirectivesModule,
    CpfCnpjModule,
    SocialLoginModule.initialize(config),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  exports: [
    RouterModule,
    
  ],
  providers: [ 
    EstabelecimentoService, 
    UsuarioService,
    AuthenticationService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogLocale, ModalDetailsComponent, DialogFaqComponent, DialogTermosComponent]
})
export class AppModule { }
