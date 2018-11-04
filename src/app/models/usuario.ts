import { Avaliacao } from "./avaliacao";

export class Usuario {
	id: any;
	primeiroNome: string = undefined;
	segundoNome: string = undefined;
	senha: string = undefined;
	email: string = undefined;
	dadosUsuarioSessao: any = {
		latitude : undefined,
		longitude : undefined,
		ipAcesso : undefined
	};
}
