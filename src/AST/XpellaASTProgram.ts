import { XpellaASTTypeDeclaration } from './XpellaASTTypeDeclaration';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTProgram {
  public static toBinaryAST(obj: XpellaASTProgram, codec: Codec) {
    return encode(obj.types, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTProgram {
    return new XpellaASTProgram(decode(buffer, {codec}));
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x3C, XpellaASTProgram, (obj) => XpellaASTProgram.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x3C, (buf) => XpellaASTProgram.fromBinaryAST(buf, codec));
  }

  public types: XpellaASTTypeDeclaration[];

  constructor(types: XpellaASTTypeDeclaration[]) {
    this.types = types;
  }

  /**
   * Returns all types that contains a valid main method
   */
  public getMainMethodTypes(): string[] {
    return this.types.filter((type) => type.methods.some((method) => {
      return method.returnType === 'void' &&
        method.identifier === 'main' &&
        method.visibility === 'public' &&
        method.modifiers.length === 1 && method.modifiers[0] === 'static';
    })).map((type) => type.identifier);
  }
}
