import { Avaliacao } from "./avaliacao";

export class Usuario {
	email : string;
	cpf : string;
	contato : string;
	senha : string;
	confirmaSenha : string;
	imagem : string;
	primeiroNome : string;
	ultimoNome : string;
	genero : string;
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
