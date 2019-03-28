import { XEASTStatement } from "./XEASTStatement";
import { XEASTExpression } from "./XEASTExpression";
import { XEASTAnnotation } from "./XEASTAnnotation";

export class XEASTCondition extends XEASTStatement {
  readonly t: string = 'con';
  c: XEASTExpression;
  pc: XEASTStatement;
  fc: XEASTStatement;

  constructor (annotations: Array<XEASTAnnotation>, condition: XEASTExpression, passConditionExecution: XEASTStatement, failConditionExecution: XEASTStatement) {
    super(annotations);
    this.c = condition;
    this.pc = passConditionExecution;
    this.fc = failConditionExecution;
  }
}