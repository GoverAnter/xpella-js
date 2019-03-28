import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

export abstract class XpellaASTObjectCall extends XpellaASTExpression {
  public object: XpellaASTExpression;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              resolvedType: string,
              object: XpellaASTExpression) {
    super(annotations, documentation, resolvedType);
    this.object = object;
  }
}
