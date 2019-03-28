import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTFunctionCall extends XpellaASTExpression {
  public static toBinaryAST(obj: XpellaASTFunctionCall, codec: Codec) {
    const array: any[] = [];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    array.push(obj.identifier);
    if (obj.args.length !== 0) {
      array.push(obj.args);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTFunctionCall {
    const array: any[] = decode(buffer, {codec});
    let offset = 0;
    if (typeof array[0] !== 'string') {
      offset = 1;
    }
    return new XpellaASTFunctionCall(offset === 1 ? array[0] : [], null, null,
                                     array[0 + offset], array[1 + offset] ? array[1 + offset] : []);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x37, XpellaASTFunctionCall, (obj) => XpellaASTFunctionCall.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x37, (buf) => XpellaASTFunctionCall.fromBinaryAST(buf, codec));
  }

  public identifier: string;
  public args: XpellaASTExpression[];

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              resolvedType: string,
              identifier: string,
              args: XpellaASTExpression[]) {
    super(annotations, documentation, resolvedType);
    this.identifier = identifier;
    this.args = args;
  }
}
