import { XpellaASTStatement } from './XpellaASTStatement';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTNode } from './XpellaASTNode';

export abstract class XpellaASTExpression extends XpellaASTStatement {
  public resolvedType: string;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, resolvedType: string) {
    super(annotations, documentation);
    this.resolvedType = resolvedType;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTExpression {
    return other instanceof XpellaASTExpression;
  }
}
