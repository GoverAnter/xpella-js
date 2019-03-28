export class XpellaScopeError extends Error {
  constructor (errorType: XpellaScopeErrors) {
    switch (errorType) {
      case XpellaScopeErrors.THIS_UNAVAILABLE:
        super('"this" is unavailable in the current context');
        break;
      default:
        super('Error while evaluating current scope');
        break;
    }
  }
}

export enum XpellaScopeErrors {
  THIS_UNAVAILABLE
}