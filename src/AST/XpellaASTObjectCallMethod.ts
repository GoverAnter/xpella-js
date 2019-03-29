import { XpellaASTObjectCall } from './XpellaASTObjectCall';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTFunctionCall } from './XpellaASTFunctionCall';
import { XpellaASTNode } from './XpellaASTNode';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTObjectCallMethod extends XpellaASTObjectCall {

  public static toBinaryAST(obj: XpellaASTObjectCallMethod, codec: Codec) {
    const array: any[] = [obj.object, obj.method];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTObjectCallMethod {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTObjectCallMethod(array[2] ? array[2] : [], null, array[0], array[1]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x3B, XpellaASTObjectCallMethod, (obj) => XpellaASTObjectCallMethod.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x3B, (buf) => XpellaASTObjectCallMethod.fromBinaryAST(buf, codec));
  }
  public method: XpellaASTFunctionCall;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              object: XpellaASTExpression,
              method: XpellaASTFunctionCall) {
    super(annotations, documentation, method.resolvedType, object);
    this.method = method;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTObjectCallMethod {
    return other instanceof XpellaASTObjectCallMethod;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTObjectCallMethod.isInstance(other)) {
      return other.object.equals(this.object) && other.method.equals(this.method);
    } else {
      return false;
    }
  }
}
