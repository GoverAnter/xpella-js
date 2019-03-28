import { XpellaASTStatement } from './XpellaASTStatement';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTBlock extends XpellaASTStatement {

  public static toBinaryAST(obj: XpellaASTBlock, codec: Codec) {
    // By optimisation, statements array will always be at least 2 elements,
    // so no need to check for packing optimisations
    const array: any[] = [obj.statements];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTBlock {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTBlock(array[1] ? array[1] : [], null, array[0]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x33, XpellaASTBlock, (obj) => XpellaASTBlock.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x33, (buf) => XpellaASTBlock.fromBinaryAST(buf, codec));
  }
  public statements: XpellaASTStatement[];

  constructor(annotations: XpellaASTAnnotation[], documentation: string, statements: XpellaASTStatement[]) {
    super(annotations, documentation);
    this.statements = statements;
  }
}
