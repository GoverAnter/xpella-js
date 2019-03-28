import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

export abstract class XpellaASTOperator extends XpellaASTExpression {
  public operator: string;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, resolvedType: string, operator: string) {
    super(annotations, documentation, resolvedType);
    this.operator = operator;
  }
}
