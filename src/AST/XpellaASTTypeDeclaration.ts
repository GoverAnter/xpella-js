import { XpellaASTDeclaration } from './XpellaASTDeclaration';
import { XpellaASTVariableDeclaration } from './XpellaASTVariableDeclaration';
import { XpellaASTFunctionDeclaration } from './XpellaASTFunctionDeclaration';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTTypeDeclaration extends XpellaASTDeclaration {
  public static toBinaryAST(obj: XpellaASTTypeDeclaration, codec: Codec) {
    const array: any[] = [obj.identifier, obj.members, obj.methods];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTTypeDeclaration {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTTypeDeclaration(array[3] ? array[3] : [], null, array[0], array[1], array[2]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x3D, XpellaASTTypeDeclaration, (obj) => XpellaASTTypeDeclaration.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x3D, (buf) => XpellaASTTypeDeclaration.fromBinaryAST(buf, codec));
  }
  public members: XpellaASTVariableDeclaration[];
  public methods: XpellaASTFunctionDeclaration[];

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              identifier: string,
              members: XpellaASTVariableDeclaration[],
              methods: XpellaASTFunctionDeclaration[]) {
    super(annotations, documentation, identifier);
    this.members = members;
    this.methods = methods;
  }
}
