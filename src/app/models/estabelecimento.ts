import { Endereco } from "./endereco";
import { Usuario } from "./usuario";
import { Avaliacao } from "./avaliacao";

export class  Estabelecimento{
    nome: string;
    cnpj: any;
    telefone: any;
    place_id: any;
    website : string;

    informacoesAdicionais:{};

    endereco: Endereco;
    proprietario: Usuario;

    avaliacao: Avaliacao;
  
constructor(){}
}