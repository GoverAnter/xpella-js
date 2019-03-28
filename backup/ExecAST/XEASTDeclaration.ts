import { XEASTNode } from "./XEASTNode";
import { XEASTAnnotation } from "./XEASTAnnotation";

export abstract class XEASTDeclaration extends XEASTNode {
  i: string;

  constructor (annotations: Array<XEASTAnnotation>, identifier: string) {
    super(annotations);
    this.i = identifier;
  }
}