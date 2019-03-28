import { XEASTExpression } from "./XEASTExpression";
import { XEASTAnnotation } from "./XEASTAnnotation";

export abstract class XEASTOperator extends XEASTExpression {
  o: number;

  constructor (annotations: Array<XEASTAnnotation>, operator: number) {
    super(annotations);
    this.o = operator;
  }
}