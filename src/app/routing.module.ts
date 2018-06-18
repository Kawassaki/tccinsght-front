import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { UserComponent } from './components/user/user.component';
import { CadastroEstabelecimentoComponent } from './components/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { QuestionarioComponent } from './components/questionario/questionario.component';

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'user', component: UserComponent },
  { path: 'cadastroEstabelecimento', component: CadastroEstabelecimentoComponent },
  // { path: 'pageNotFound', component: PageNotFoundComponent },
  // { path: 'home', component: HomePageComponent},
  { path: 'questionario', component: QuestionarioComponent},
  { path: '*/', component: HomePageComponent},

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
