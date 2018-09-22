import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { UserComponent } from './components/user/user.component';
import { CadastroEstabelecimentoComponent } from './components/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { QuestionarioComponent } from './components/questionario/questionario.component';
import { LoginComponent } from './components/login/login.component';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';

const routes: Routes = [
  { path: 'busca', component: MapComponent },
  { path: 'user', component: UserComponent },
  { path: 'cadastro', component: CadastrarComponent },
  { path: '*/', component: MapComponent},
  { path: '', component: MapComponent},
  { path: 'login', component: LoginComponent},
  { path: 'cadastroEstabelecimento', component: CadastroEstabelecimentoComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
