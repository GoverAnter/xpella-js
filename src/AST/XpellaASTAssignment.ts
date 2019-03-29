import { XpellaASTStatement } from './XpellaASTStatement';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTVariable } from './XpellaASTVariable';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTNode } from './XpellaASTNode';

import { encode, decode, Codec } from 'msgpack-lite';
import { XpellaASTObjectCallMember } from './XpellaASTObjectCallMember';

export class XpellaASTAssignment extends XpellaASTStatement {

  public static toBinaryAST(obj: XpellaASTAssignment, codec: Codec) {
    const array: any[] = [obj.variable, obj.expression];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTAssignment {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTAssignment(array[2] ? array[2] : [], null, array[0], array[1]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x32, XpellaASTAssignment, (obj) => XpellaASTAssignment.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x32, (buf) => XpellaASTAssignment.fromBinaryAST(buf, codec));
  }
  public variable: XpellaASTVariable | XpellaASTObjectCallMember;
  public expression: XpellaASTExpression;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              variable: XpellaASTVariable | XpellaASTObjectCallMember,
              expression: XpellaASTExpression) {
    super(annotations, documentation);
    this.variable = variable;
    this.expression = expression;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTAssignment {
    return other instanceof XpellaASTAssignment;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTAssignment.isInstance(other)) {
      return other.expression.equals(this.expression) && other.variable.equals(this.variable);
    } else {
      return false;
    }
  }
}
