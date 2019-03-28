import { XEASTDeclaration } from "./XEASTDeclaration";
import { XEASTExpression } from "./XEASTExpression";
import { XEASTAnnotation } from "./XEASTAnnotation";
import { XEASTLiteral } from "./XEASTLiteral";

export class XEASTVariableDeclaration extends XEASTDeclaration {
  readonly t: string = 'vad';
  ty: string;
  v: string;
  m: Array<string>;
  ia: XEASTExpression;

  constructor (annotations: Array<XEASTAnnotation>, identifier: string, type: string, visibility: string, modifiers: Array<string>, initialAssignation: XEASTExpression = new XEASTLiteral([], null)) {
    super(annotations, identifier);
    this.ty = type;
    this.v = visibility;
    this.m = modifiers;
    this.ia = initialAssignation;
  }
}