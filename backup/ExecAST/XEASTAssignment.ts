import { XEASTStatement } from "./XEASTStatement";
import { XEASTExpression } from "./XEASTExpression";
import { XEASTAnnotation } from "./XEASTAnnotation";
import { XEASTVariable } from "./XEASTVariable";

export class XEASTAssignment extends XEASTStatement {
  readonly t: 'a2s';
  v: XEASTVariable;
  x: XEASTExpression;

  constructor (annotations: Array<XEASTAnnotation>, variable: XEASTVariable, expression: XEASTExpression) {
    super(annotations);
    this.v = variable;
    this.x = expression;
  }
}