export class ActionNotPermittedError extends Error {
  constructor(message = 'Ação não permitida.') {
    super(message);
  }
}
