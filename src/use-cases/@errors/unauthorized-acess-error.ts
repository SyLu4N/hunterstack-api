export class UnauthorizedAcessError extends Error {
  constructor(message = 'Acesso não autorizado.') {
    super(message);
  }
}
