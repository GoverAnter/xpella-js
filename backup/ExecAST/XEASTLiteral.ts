import { XEASTExpression } from "./XEASTExpression";
import { XEASTAnnotation } from "./XEASTAnnotation";

export class XEASTLiteral extends XEASTExpression {
  readonly t = 'lit';
  v: any;

  constructor (annotations: Array<XEASTAnnotation>, value: any) {
    super(annotations);
    this.v = value;
  }
}