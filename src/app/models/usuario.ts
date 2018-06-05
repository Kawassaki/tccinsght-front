import { Avaliacao } from "./avaliacao";

export class Usuario {
	email : string;
	cpf : string;
	contato : string;
	senha : string;
	imagem : string;
	primeiroNome : string;
	ultimoNome : string;
	sexo : string;
	dataCadastro: any;
	proprietario : boolean;
	banco : string;
	idBanco: any;
	agencia : string;
	conta : string;
	titularConta : boolean;
	nomeTitular : string;
	cpfTitular : string;
	
	latitude: any;
    longitude: any;
    ipDeAcesso: any;
	permiteLocaliacao: boolean;
}
