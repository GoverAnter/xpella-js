import { XpellaASTNode } from './XpellaASTNode';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

export abstract class XpellaASTDeclaration extends XpellaASTNode {
  public identifier: string;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, identifier: string) {
    super(annotations, documentation);
    this.identifier = identifier;
  }
}
