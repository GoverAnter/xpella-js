import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTOperator } from './XpellaASTOperator';
import { XpellaASTNode } from './XpellaASTNode';
import { XpellaParserExpressionOperatorsArray } from '../Parser/Definitions/XpellaKeywords';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTExpressionOperator extends XpellaASTOperator {

  public static toBinaryAST(obj: XpellaASTExpressionOperator, codec: Codec) {
    const array: any[] = [XpellaParserExpressionOperatorsArray.indexOf(obj.operator), obj.left, obj.right];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTExpressionOperator {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTExpressionOperator
      (array[3] ? array[3] : [], null, null, XpellaParserExpressionOperatorsArray[array[0]], array[1], array[2]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x35, XpellaASTExpressionOperator, (obj) => XpellaASTExpressionOperator.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x35, (buf) => XpellaASTExpressionOperator.fromBinaryAST(buf, codec));
  }
  public left: XpellaASTExpression;
  public right: XpellaASTExpression;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              resolvedType: string,
              operator: string,
              left: XpellaASTExpression,
              right: XpellaASTExpression) {
    super(annotations, documentation, resolvedType, operator);
    this.left = left;
    this.right = right;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTExpressionOperator {
    return other instanceof XpellaASTExpressionOperator;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTExpressionOperator.isInstance(other)) {
      return other.operator === this.operator &&
        other.left.equals(this.left) &&
        other.right.equals(this.right);
    } else {
      return false;
    }
  }
}
