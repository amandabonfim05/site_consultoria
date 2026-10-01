export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Não autorizado') {
    super(401, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflito de dados') {
    super(409, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Requisição inválida') {
    super(400, message);
  }
}
