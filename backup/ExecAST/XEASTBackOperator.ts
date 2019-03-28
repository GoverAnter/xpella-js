import { XEASTOperator } from "./XEASTOperator";
import { XEASTAnnotation } from "./XEASTAnnotation";
import { XEASTVariable } from "./XEASTVariable";

export class XEASTBackOperator extends XEASTOperator {
  readonly t: string = 'bop';
  r: XEASTVariable;

  constructor (annotations: Array<XEASTAnnotation>, operator: number, right: XEASTVariable) {
    super(annotations, operator);
    this.o = operator;
    this.r = right;
  }
}