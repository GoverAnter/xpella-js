import { XEASTLiteral } from "./XEASTLiteral";

export class XEASTAnnotation {
  i: string;
  ag: Array<XEASTLiteral>;

  constructor (identifier: string, args: Array<XEASTLiteral>) {
    this.i = identifier;
    this.ag = args;
  }
}