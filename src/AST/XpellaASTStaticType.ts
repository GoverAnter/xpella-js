import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTStaticType extends XpellaASTExpression {
  public static toBinaryAST(obj: XpellaASTStaticType, codec: Codec) {
    // By optimisation, statements array will always be at least 2 elements,
    // so no need to check for packing optimisations
    const array: any[] = [obj.resolvedType];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTStaticType {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTStaticType(array[1] ? array[1] : [], null, array[0]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x41, XpellaASTStaticType, (obj) => XpellaASTStaticType.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x41, (buf) => XpellaASTStaticType.fromBinaryAST(buf, codec));
  }

  constructor(annotations: XpellaASTAnnotation[], documentation: string, type: string) {
    super(annotations, documentation, type);
  }
}
