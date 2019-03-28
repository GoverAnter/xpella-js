import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTOperator } from './XpellaASTOperator';
import { XpellaASTVariable } from './XpellaASTVariable';
import { XpellaParserBackOperators } from '../Parser/Definitions/XpellaKeywords';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTBackOperator extends XpellaASTOperator {

  public static toBinaryAST(obj: XpellaASTBackOperator, codec: Codec) {
    // small ints are more efficient than string, that's why we store operators as an index
    const array: any[] = [XpellaParserBackOperators.indexOf(obj.operator), obj.right];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTBackOperator {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTBackOperator
      (array[2] ? array[2] : [], null, null, XpellaParserBackOperators[array[0]], array[1]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x31, XpellaASTBackOperator, (obj) => XpellaASTBackOperator.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x31, (buf) => XpellaASTBackOperator.fromBinaryAST(buf, codec));
  }
  public right: XpellaASTVariable;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              resolvedType: string,
              operator: string,
              right: XpellaASTVariable) {
    super(annotations, documentation, resolvedType, operator);
    this.right = right;
  }
}
