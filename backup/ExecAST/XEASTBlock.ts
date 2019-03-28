import { XEASTStatement } from "./XEASTStatement";
import { XEASTAnnotation } from "./XEASTAnnotation";

export class XEASTBlock extends XEASTStatement {
  readonly t: string = 'blk';
  s: Array<XEASTStatement>;

  constructor (annotations: Array<XEASTAnnotation>, statements: Array<XEASTStatement>) {
    super(annotations);
    this.s = statements;
  }
}