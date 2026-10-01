export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  consultor: {
    id: string;
    nome: string;
    email: string;
  };
}
