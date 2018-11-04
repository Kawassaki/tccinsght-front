import { Endereco } from "./endereco";
import { Usuario } from "./usuario";
import { Avaliacao } from "./avaliacao";
import { Pagamento } from "./pagamento";
import { Detalhes } from "./detalhes";

export class  Estabelecimento{

    id : any;
    placeId : string;
    nome: string;
    contato: string;
    email: string;
    website : string;
    endereco : string;
    usuario : Usuario;
    pagamento: Pagamento;
    detalhes : Detalhes[];
    avaliacao : Avaliacao;
  
constructor(){}
}