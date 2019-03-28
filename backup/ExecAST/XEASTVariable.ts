import { XEASTExpression } from "./XEASTExpression";
import { XEASTAnnotation } from "./XEASTAnnotation";

export class XEASTVariable extends XEASTExpression {
  readonly t: 'var';
  i: string;

  constructor (annotations: Array<XEASTAnnotation>, identifier: string) {
    super(annotations);
    this.i= identifier;
  }
}