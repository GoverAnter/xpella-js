import { XEASTOperator } from "./XEASTOperator";
import { XEASTAnnotation } from "./XEASTAnnotation";
import { XEASTVariable } from "./XEASTVariable";

export class XEASTFrontOperator extends XEASTOperator {
  readonly t: string = 'fop';
  l: XEASTVariable;

  constructor (annotations: Array<XEASTAnnotation>, operator: number, left: XEASTVariable) {
    super(annotations, operator);
    this.o = operator;
    this.l = left;
  }
}