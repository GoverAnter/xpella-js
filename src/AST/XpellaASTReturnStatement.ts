import { XpellaASTStatement } from './XpellaASTStatement';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTNode } from './XpellaASTNode';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTReturnStatement extends XpellaASTStatement {
  public static toBinaryAST(obj: XpellaASTReturnStatement, codec: Codec) {
    // By optimisation, statements array will always be at least 2 elements,
    // so no need to check for packing optimisations
    const array: any[] = [obj.expression];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTReturnStatement {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTReturnStatement(array[1] ? array[1] : [], null, array[0]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x40, XpellaASTReturnStatement, (obj) => XpellaASTReturnStatement.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x40, (buf) => XpellaASTReturnStatement.fromBinaryAST(buf, codec));
  }

  public expression: XpellaASTExpression;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, expression: XpellaASTExpression = null) {
    super(annotations, documentation);
    this.expression = expression;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTReturnStatement {
    return other instanceof XpellaASTReturnStatement;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTReturnStatement.isInstance(other)) {
      return (other.expression !== null && other.expression.equals(this.expression)) || this.expression == null;
    } else {
      return false;
    }
  }
}
