export class XpellaParseError extends Error {
  constructor (errorType: XpellaParseErrors) {
    switch (errorType) {
      case XpellaParseErrors.EXPR_EXPECTED:
        super('Expression expected');
        break;
      case XpellaParseErrors.NO_ANY_DECL:
        super('Cannot declare a variable typed "any" with no value');
        break;
      default:
        super('Error while parsing');
        break;
    }
  }
}

export enum XpellaParseErrors {
  EXPR_EXPECTED,
  NO_ANY_DECL
}