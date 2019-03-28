import { XEASTAnnotation } from "./XEASTAnnotation";

export abstract class XEASTNode {
  an: Array<XEASTAnnotation>;

  constructor (annotations: Array<XEASTAnnotation>) {
    this.an = annotations;
  }
}