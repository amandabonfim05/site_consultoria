export interface SignUpPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface SignUpResponse {
  token: string;
  consultor: {
    id: string;
    nome: string;
    email: string;
  };
}
