import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTNode } from './XpellaASTNode';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTLiteral extends XpellaASTExpression {
  public static toBinaryAST(obj: XpellaASTLiteral, codec: Codec) {
    const array: any[] = [obj.value];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTLiteral {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTLiteral(array[1] ? array[1] : [], null, array[0], null);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x39, XpellaASTLiteral, (obj) => XpellaASTLiteral.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x39, (buf) => XpellaASTLiteral.fromBinaryAST(buf, codec));
  }
  public value: any;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, value: any, resolvedType: string) {
    super(annotations, documentation, resolvedType);
    this.value = value;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTLiteral {
    return other instanceof XpellaASTLiteral;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTLiteral.isInstance(other)) {
      return other.value === this.value;
    } else {
      return false;
    }
  }
}
