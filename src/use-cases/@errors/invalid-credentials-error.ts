export class InvalidCredentialsError extends Error {
  constructor(message = 'E-mail ou senha inválidos.') {
    super(message);
  }
}
