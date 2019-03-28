export class DeclarationError extends Error {
  constructor(name: string, type: DeclarationErrors) {
    switch (type) {
      case DeclarationErrors.UNDECLARED:
        super('"' + name + '" is undeclared');
        break;
      case DeclarationErrors.REDECLARED:
        super('"' + name + '" is already declared');
        break;
      default:
        super('Error with "' + name + '" declaration');
        break;
    }
  }
}

export enum DeclarationErrors {
  UNDECLARED,
  REDECLARED
}