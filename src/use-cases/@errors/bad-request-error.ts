export class BadRequestError extends Error {
  constructor(message = 'Requisição inválida.') {
    super(message);
  }
}
