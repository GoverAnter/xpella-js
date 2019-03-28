import { XpellaASTStatement } from './XpellaASTStatement';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

export abstract class XpellaASTExpression extends XpellaASTStatement {
  public resolvedType: string;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, resolvedType: string) {
    super(annotations, documentation);
    this.resolvedType = resolvedType;
  }
}
