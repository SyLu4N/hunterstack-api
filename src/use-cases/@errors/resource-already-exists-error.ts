export class ResourceAlreadyExistsError extends Error {
  constructor(message = 'Propriedade já cadastrada/criada.') {
    super(message);
  }
}
