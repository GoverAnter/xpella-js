import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTOperator } from './XpellaASTOperator';
import { XpellaASTVariable } from './XpellaASTVariable';
import { XpellaParserFrontOperators } from '../Parser/Definitions/XpellaKeywords';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTFrontOperator extends XpellaASTOperator {

  public static toBinaryAST(obj: XpellaASTFrontOperator, codec: Codec) {
    const array: any[] = [XpellaParserFrontOperators.indexOf(obj.operator), obj.left];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTFrontOperator {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTFrontOperator
      (array[2] ? array[2] : [], null, null, XpellaParserFrontOperators[array[0]], array[1]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x36, XpellaASTFrontOperator, (obj) => XpellaASTFrontOperator.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x36, (buf) => XpellaASTFrontOperator.fromBinaryAST(buf, codec));
  }
  public left: XpellaASTVariable;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              resolvedType: string,
              operator: string,
              left: XpellaASTVariable) {
    super(annotations, documentation, resolvedType, operator);
    this.left = left;
  }
}
