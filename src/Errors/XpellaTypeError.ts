export class XpellaTypeError extends Error {
  constructor (type: string, otherTypes: Array<string>, errorType: XpellaTypeErrors) {
    switch (errorType) {
      case XpellaTypeErrors.UNKNOWN:
        super('Type "' + type + '" is undeclared');
        break;
      case XpellaTypeErrors.NOT_ASSIGNABLE:
        super('Type "' + otherTypes[0] + '" is not assignable from "' + type + '"');
        break;
      case XpellaTypeErrors.NOT_ASSIGNABLE:
        super('No matching constructor for type "' + type + '" with arguments "' + otherTypes.join(',') + '"');
        break;
      default:
        super('Error with type "' + type + '"');
        break;
    }
  }
}

export enum XpellaTypeErrors {
  UNKNOWN,
  NOT_ASSIGNABLE,
  NO_MATCHING_CONSTRUCTOR
}