import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTVariable extends XpellaASTExpression {

  public static toBinaryAST(obj: XpellaASTVariable, codec: Codec) {
    const array: any[] = [obj.identifier];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTVariable {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTVariable(array[1] ? array[1] : [], null, null, array[0]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x3E, XpellaASTVariable, (obj) => XpellaASTVariable.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x3E, (buf) => XpellaASTVariable.fromBinaryAST(buf, codec));
  }
  public identifier: string;

  constructor(annotations: XpellaASTAnnotation[], documentation: string, resolvedType: string, identifier: string) {
    super(annotations, documentation, resolvedType);
    this.identifier = identifier;
  }
}
