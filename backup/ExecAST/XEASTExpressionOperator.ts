import { XEASTOperator } from "./XEASTOperator";
import { XEASTAnnotation } from "./XEASTAnnotation";
import { XEASTExpression } from "./XEASTExpression";

export class XEASTExpressionOperator extends XEASTOperator {
  readonly t: string = 'eop';
  l: XEASTExpression;
  r: XEASTExpression;

  constructor (annotations: Array<XEASTAnnotation>, operator: number, left: XEASTExpression, right: XEASTExpression) {
    super(annotations, operator);
    this.o = operator;
    this.l = left;
    this.r = right;
  }
}