export class InvalidParseInputError extends Error {
  constructor () {
    super('Cannot parse an undefined, null or empty string');
  }
}